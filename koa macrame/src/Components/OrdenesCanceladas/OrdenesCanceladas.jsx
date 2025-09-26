import React, { useEffect, useState } from "react";
import { getOrdenes, updateOrdenEstado } from "../../Services/Servicios";
import "./OrdenesCanceladas.css";
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";

function OrdenesCanceladas() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getOrdenes();
        // ✅ Solo mostrar las que estén en estado "cancelado"
        setOrdenes(data.filter((o) => o.estado === "cancelado"));
      } catch (err) {
        console.error("Error al cargar órdenes canceladas:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const reactivarPedido = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres reactivar este pedido? Pasará nuevamente a 'pendiente'."
    );
    if (!confirmar) return;

    try {
      await updateOrdenEstado(id, "pendiente");
      // ✅ Quita de la lista de cancelados en la interfaz
      setOrdenes((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error al reactivar pedido:", err);
      alert("Hubo un problema al reactivar el pedido.");
    }
  };

  if (cargando) return <p>Cargando pedidos cancelados...</p>;

  return (
    <div>
      

      <div className="ordenes-canceladas">
        <h1>Pedidos Cancelados</h1>

        {ordenes.length === 0 ? (
          <p>No hay pedidos cancelados.</p>
        ) : (
          <div className="lista-ordenes">
            {ordenes.map((o) => (
              <div key={o.id} className="orden-card">
                <h3>Pedido #{o.id}</h3>
                <p><strong>Cliente:</strong> {o.usuario.nombre}</p>
                <p><strong>Email:</strong> {o.usuario.email}</p>
                <p><strong>Teléfono:</strong> {o.usuario.telefono}</p>
                <p><strong>Dirección:</strong> {o.usuario.direccion}</p>
                {o.usuario.observaciones && (
                  <p><strong>Observaciones:</strong> {o.usuario.observaciones}</p>
                )}
                <p><strong>Tipo de Envío:</strong> {o.tipoEnvio}</p>
                <p><strong>Total:</strong> ${o.total.toLocaleString()}</p>

                <h4>Productos:</h4>
                <ul>
                  {o.productos.map((p) => (
                    <li key={p.id}>
                      {p.nombre} – Cant: {p.cantidad} – Precio: ${p.precio}
                    </li>
                  ))}
                </ul>

                <div className="acciones-pedido">
                  <button className="btn-reactivar" onClick={() => reactivarPedido(o.id)}>
                    Activar nuevamente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdenesCanceladas;
