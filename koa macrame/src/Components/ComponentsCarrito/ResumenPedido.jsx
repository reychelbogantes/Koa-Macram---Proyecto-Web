import React from 'react';

function ResumenPedido({ productos = [], tipoEnvio }) {
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

      <button className="btn-comprar">Comprar ahora</button>
    </div>
  );
}

export default ResumenPedido;
