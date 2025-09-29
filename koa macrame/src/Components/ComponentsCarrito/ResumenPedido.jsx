import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  guardarFactura,
  guardarOrden,
  vaciarCarrito,
  getDireccionSeleccionada
} from "../../Services/Servicios";
import ModalAlert from "../../Components/ModalAlert/ModalAlert"; // ⚠️ Ajusta la ruta si es distinta

function ResumenPedido({ productos = [], tipoEnvio, setCarrito, seleccionados = [] }) {
  // 1️⃣ Subtotal
  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // 2️⃣ Costo de envío
  let costoEnvio = 0;
  switch (tipoEnvio) {
    case "Correo de Costa Rica":
      costoEnvio = subtotal >= 1500 ? 0 : 7;
      break;
    case "retiro":
      costoEnvio = 0;
      break;
    default:
      costoEnvio = 0;
  }

  // 3️⃣ Total
  const total = subtotal + costoEnvio;

  // ✅ Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
console.log('modalMsg =>', modalMsg);
  return (
    <div className="resumen-pedido">
      <h3>Resumen Del Pedido</h3>

      <p className="precio-estimado">
        Precio Estimado: <strong>${subtotal.toLocaleString()}</strong>
      </p>

      <p className="costo-envio">
        Costo de envío:{" "}
        {tipoEnvio === "retiro" ? (
          <strong>$0 por retiro local</strong>
        ) : costoEnvio === 0 ? (
          <strong>Envío gratis en compras de $1500 o más.</strong>
        ) : (
          <strong>${costoEnvio.toLocaleString()}</strong>
        )}
      </p>

      <hr />

      <p className="monto-total">
        Total a pagar: <strong>${total.toLocaleString()}</strong>
      </p>

      <PayPalButtons
        style={{
          layout: "vertical",
          color: "silver",
          shape: "rect",
          label: "paypal",
        }}
        disabled={productos.length === 0}
        forceReRender={[productos.length]}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: total.toFixed(2),
                  currency_code: "USD",
                },
                description: "Compra en Koa Macramé",
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(async function (details) {
            // ✅ Reemplazo de alert por modal
            setModalMsg(`Pago completado por ${details.payer.name.given_name}`);
            setModalOpen(true);

            try {
              const userData = JSON.parse(localStorage.getItem("usuarioLogueado"));
              if (!userData || !userData.id) throw new Error("No hay usuario logueado");

              const direccionSel = await getDireccionSeleccionada(userData.id);
              if (!direccionSel) throw new Error("No hay dirección seleccionada");

              const nuevaFactura = {
                fecha: new Date().toISOString(),
                usuario: {
                  nombre: userData.name,
                  email: userData.email,
                },
                productos: productos.map((p) => ({
                  id: p.id,
                  nombre: p.nombre,
                  cantidad: p.cantidad,
                  precio: p.precio,
                })),
                tipoEnvio,
                subtotal,
                costoEnvio,
                total,
                idTransaccion: details.id,
              };

              const nuevaOrden = {
                ...nuevaFactura,
                usuario: {
                  ...nuevaFactura.usuario,
                  direccion: direccionSel.direccion,
                  telefono: direccionSel.telefono,
                  observaciones: direccionSel.observaciones || "",
                },
                estado: "pendiente",
              };

              await guardarFactura(nuevaFactura);
              await guardarOrden(nuevaOrden);

              await vaciarCarrito(seleccionados);
              setCarrito((prev) => prev.filter((p) => !seleccionados.includes(p.id)));

              console.log("Factura y Orden guardadas correctamente con dirección seleccionada.");
            } catch (error) {
              console.error("Error en post-pago", error);
              setModalMsg("No se pudo guardar la orden: " + error.message);
              setModalOpen(true);
            }
          });
        }}
        onError={(err) => {
          console.error("Error en el pago", err);
          setModalMsg("Hubo un problema procesando el pago.");
          setModalOpen(true);
        }}
      />

      {/* ✅ Modal de alerta que reemplaza todos los alert() */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aviso"
        message={modalMsg}
      />
    </div>
  );
}

export default ResumenPedido;


