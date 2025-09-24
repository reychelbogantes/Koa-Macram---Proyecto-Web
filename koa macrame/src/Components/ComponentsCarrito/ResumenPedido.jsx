import React from "react";
import { PayPalButtons } from "@paypal/react-paypal-js";
import {guardarFactura, guardarOrden, vaciarCarrito, getDireccionSeleccionada} from "../../Services/Servicios";

function ResumenPedido({ productos = [], tipoEnvio, setCarrito, seleccionados = [] }) {
  // 1️⃣ Subtotal: suma de precios * cantidad
  const subtotal = productos.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  // 2️⃣ Costo de envío según el tipo de envío seleccionado
  let costoEnvio = 0;
  switch (tipoEnvio) {
    case "Correo de Costa Rica":
      // ₡7 si subtotal < 1500, gratis si >= 1500
      costoEnvio = subtotal >= 1500 ? 0 : 7;
      break;
    case "retiro":
      // Retiro en tienda: siempre gratis
      costoEnvio = 0;
      break;
    default:
      costoEnvio = 0;
  }

  // 3️⃣ Total: subtotal + envío
  const total = subtotal + costoEnvio;

  return (
    <div className="resumen-pedido">
      <h3>Resumen Del Pedido</h3>

      <p className="precio-estimado">
        Precio Estimado: <strong>₡{subtotal.toLocaleString()}</strong>
      </p>

      <p className="costo-envio">
        Costo de envío:{" "}
        {tipoEnvio === "retiro" ? (
          <strong>₡0 por retiro local</strong>
        ) : costoEnvio === 0 ? (
          <strong>Envío gratis en compras de ₡1,500 o más.</strong>
        ) : (
          <strong>₡{costoEnvio.toLocaleString()}</strong>
        )}
      </p>

      <hr />

      <p className="monto-total">
        Total a pagar: <strong>₡{total.toLocaleString()}</strong>
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
                  value: total.toFixed(2), // ⚠️ PayPal trabaja en USD; ajusta si usas otra moneda
                  currency_code: "USD",
                },
                description: "Compra en Koa Macramé",
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(async function (details) {
            alert(`Pago completado por ${details.payer.name.given_name}`);

            try {
              // ✅ 1. Obtener usuario logueado (debe tener id para consultar direcciones)
              const userData = JSON.parse(localStorage.getItem("usuarioLogueado"));
              if (!userData || !userData.id) throw new Error("No hay usuario logueado");

              // ✅ 2. Consultar dirección seleccionada en db.json
              const direccionSel = await getDireccionSeleccionada(userData.id);
              if (!direccionSel) throw new Error("No hay dirección seleccionada");

              // ✅ 3. Armar factura
              const nuevaFactura = {
                fecha: new Date().toISOString(),
                usuario: {
                  nombre: details.payer.name.given_name,
                  email: details.payer.email_address,
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

              // ✅ 4. Armar orden con dirección y estado "pendiente"
              const nuevaOrden = {
                ...nuevaFactura,
                usuario: {
                  ...nuevaFactura.usuario,
                  nombre: direccionSel.nombre,
                  direccion: direccionSel.direccion,
                  telefono: direccionSel.telefono,
                  observaciones: direccionSel.observaciones || "",
                },
                estado: "pendiente",
              };

              // ✅ 5. Guardar factura y orden
              await guardarFactura(nuevaFactura);
              await guardarOrden(nuevaOrden);

              // ✅ 6. Vaciar carrito
              await vaciarCarrito(seleccionados);
              setCarrito((prev) => prev.filter((p) => !seleccionados.includes(p.id)));

              console.log("Factura y Orden guardadas correctamente con dirección seleccionada.");
            } catch (error) {
              console.error("Error en post-pago", error);
              alert("No se pudo guardar la orden: " + error.message);
            }
          });
        }}
        onError={(err) => {
          console.error("Error en el pago", err);
          alert("Hubo un problema procesando el pago.");
        }}
      />
    </div>
  );
}

export default ResumenPedido;

