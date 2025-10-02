import React, { useState } from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {
  guardarFactura,
  guardarOrden,
  vaciarCarrito,
  getDireccionSeleccionada,
  getCarritoPorUsuario,   // ✅ para recargar el carrito actualizado
  getProductos           // ✅ para reconstruir los datos completos
} from "../../Services/Servicios";
import ModalAlert from "../../Components/ModalAlert/ModalAlert";

function ResumenPedido({
  productos = [],
  tipoEnvio,
  setCarrito,
  seleccionados = [],
  carritoId
}) {
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

  console.log("carritoId =>", carritoId);
  console.log("seleccionados =>", seleccionados);

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
            // 🔄 Recargar automáticamente la página después de 2 segundos
            setTimeout(() => {
              window.location.reload();
            }, 2000);

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

              // ✅ Vacía o descuenta las cantidades en el backend
              await vaciarCarrito(
                carritoId,
                productos.map(p => ({ productoId: p.id, cantidad: p.cantidad }))
              );

              // ✅ Vuelve a cargar el carrito desde el backend para que el front muestre la cantidad real
              const c = await getCarritoPorUsuario(userData.id);
              if (c && c.productos && c.productos.length > 0) {
                const allProducts = await getProductos();
                const lista = c.productos
                  .map(item => {
                    const prod = allProducts.find(p => p.id === item.productoId);
                    return prod ? { ...prod, cantidad: item.cantidad } : null;
                  })
                  .filter(Boolean);
                setCarrito(lista);
              } else {
                setCarrito([]);
              }

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


