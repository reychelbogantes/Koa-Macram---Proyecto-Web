import React from 'react';
import { PayPalButtons } from "@paypal/react-paypal-js";
import { guardarFactura, vaciarCarrito } from "../../Services/Servicios";

function ResumenPedido({ productos = [], tipoEnvio, setCarrito, seleccionados = [] }) {
  // 1️⃣ Subtotal: suma de precios * cantidad
  const subtotal = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  // 2️⃣ Costo de envío según el tipo de envío seleccionado
  let costoEnvio = 0;

  switch (tipoEnvio) {
    case "Correo de Costa Rica":
      // $7 si subtotal < 1500, gratis si >= 1500
      costoEnvio = subtotal >= 1500 ? 0 : 7;
      break;

    case "retiro":
      // Retiro en tienda: siempre gratis
      costoEnvio = 0;
      break;

    default:
      // Si no hay tipo de envío aún, asumimos 0
      costoEnvio = 0;
  }

  // 3️⃣ Total: subtotal + envío
  const total = subtotal + costoEnvio;

  return (
    <div className="resumen-pedido">
      <h3>Resumen Del Pedido</h3>

      <p className="precio-estimado">
        Precio Estimado: <strong>${subtotal.toLocaleString()}</strong>
      </p>

      <p className="costo-envio">
        Costo de envío:{" "}
        {tipoEnvio === "retiro"
          ? <strong>₡0 por retiro local</strong>
          : (
              costoEnvio === 0
                ? <strong>Envío gratis en compras de ₡1,500 o más.</strong>
                : <strong>₡{costoEnvio.toLocaleString()}</strong>
            )
        }
      </p>

      <hr />

      <p className="monto-total">
        Total a pagar: <strong>${total.toLocaleString()}</strong>
      </p>


<PayPalButtons
         style={{
    layout: "vertical",   // u "horizontal"
    color: "silver",        // 🎨 color del botón
    shape: "rect",        // o "pill"
    label: "paypal"       // texto del botón: "paypal", "pay", "checkout"…
  }}
           disabled={productos.length === 0}
           forceReRender={[productos.length]} // ✅ obliga a re-renderizar cuando cambia
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: total.toFixed(2), // total en USD si PayPal está en USD
                currency_code: "USD"
              },
              description: "Compra en Koa Macramé"
            }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(async function (details) {
            alert(`Pago completado por ${details.payer.name.given_name}`);

            // ✅ Arma el objeto de facturación
            const nuevaFactura = {
              fecha: new Date().toISOString(),
              usuario: {
                nombre: details.payer.name.given_name,
                email: details.payer.email_address
              },
              productos: productos.map(p => ({
                id: p.id,
                nombre: p.nombre,
                cantidad: p.cantidad,
                precio: p.precio
              })),
              tipoEnvio,
              subtotal,
              costoEnvio,
              total,
              idTransaccion: details.id
            };

            try {
              // ✅ Guardar factura
              await guardarFactura(nuevaFactura);

             // ✅ Vaciar carrito (elige a o b)
             await vaciarCarrito(seleccionados); // si usás JSON-Server
             setCarrito(prev => prev.filter(p => !seleccionados.includes(p.id)));
            // setCarrito([]); // si es sólo estado local
             console.log("Factura guardada y productos seleccionados eliminados del carrito.");
            } catch (error) {
              console.error("Error en post-pago", error);
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
