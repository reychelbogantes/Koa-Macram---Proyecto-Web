import React, { useEffect, useState } from "react";
import { getFacturas } from "../../Services/Servicios";
import "./PedidosUsuario.css";

/**
 * Componente que lista los pedidos de un usuario
 * @param {Object} props
 * @param {Object} props.usuario  -> usuario logueado { id, name, email, ... }
 */

function PedidosUsuario({ usuario }) {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargarPedidos() {
      try {
        const todas = await getFacturas();
        // ✅ Filtra por email del usuario
        const misPedidos = todas
          .filter(f => f.usuario?.email === usuario.email)
          .sort((a,b) => new Date(b.fecha) - new Date(a.fecha)); // más recientes primero
        setPedidos(misPedidos);
      } catch (err) {
        console.error("Error cargando pedidos:", err);
      } finally {
        setLoading(false);
      }
    }

    if (usuario?.email) {
      cargarPedidos();
    }
  }, [usuario]);

  if (!usuario) {
    return <p>Debe iniciar sesión para ver sus pedidos.</p>;
  }

  if (loading) {
    return <p>Cargando pedidos...</p>;
  }

  return (
    <div className="pedidos-usuario">
      <h2>📦 Pedidos de {usuario.name || usuario.nombre}</h2>

      {pedidos.length === 0 ? (
        <p>No se encontraron pedidos registrados para este usuario.</p>
      ) : (
        <table className="tabla-pedidos">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Productos</th>
              <th>Subtotal</th>
              <th>Costo envío</th>
              <th>Total</th>
              <th>ID Transacción</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.fecha).toLocaleString()}</td>
                <td>
                  {p.productos.map(prod => (
                    <div key={prod.id}>
                      {prod.nombre} — {prod.cantidad} u.
                    </div>
                  ))}
                </td>
                <td>${p.subtotal}</td>
                <td>${p.costoEnvio}</td>
                <td><strong>${p.total}</strong></td>
                <td>{p.idTransaccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PedidosUsuario;