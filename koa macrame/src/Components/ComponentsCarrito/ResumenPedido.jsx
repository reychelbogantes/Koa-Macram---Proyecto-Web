import React from 'react';

function ResumenPedido({ productos = [] }) {
  // 1️⃣ Subtotal: suma de precios * cantidad
  const subtotal = productos.reduce(
    (acc, p) => acc + p.precio * p.cantidad,
    0
  );

  // 2️⃣ Costo de envío: $7 si subtotal < 1500, gratis si >= 1500
  const envio = subtotal >= 1500 ? 0 : 7;

  // 3️⃣ Total: subtotal + envío
  const total = subtotal + envio;

  return (
    <div className="resumen-pedido">
      <h3>Resumen Del Pedido</h3>

      <p className="precio-estimado">
        Precio Estimado: <strong>₡{subtotal.toLocaleString()}</strong>
      </p>

      <p className="costo-envio">
        Costo de envío:{" "}
        {envio === 0
          ? <strong>Envío gratis en compras de $1,500 o más.</strong>
          : <strong>${envio.toLocaleString()}</strong>}
      </p>

      <hr />

      <p className="monto-total">
        Total a pagar: <strong>${total.toLocaleString()}</strong>
      </p>

      <button className="btn-comprar">Comprar ahora</button>

      <p className="nota">
       
      </p>
    </div>
  );
}

export default ResumenPedido;
