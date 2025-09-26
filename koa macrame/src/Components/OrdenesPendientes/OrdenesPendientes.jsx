import React, { useEffect, useState } from "react";
import { getOrdenes, updateOrdenEstado } from "../../Services/Servicios";
import "./OrdenesPendientes.css";
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";

function OrdenesPendientes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getOrdenes();
        // ✅ Solo mostrar las que estén en estado "pendiente"
        setOrdenes(data.filter((o) => o.estado === "pendiente"));
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const marcarEnviado = async (id) => {
    try {
      await updateOrdenEstado(id, "enviado");
      // Quita de la lista de pendientes
      setOrdenes((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error al marcar como enviado:", err);
    }
  };

  const cancelarPedido = async (id) => {
    const confirmar = window.confirm(
      "¿Seguro que quieres cancelar este pedido? Podrás verlo en la sección de pedidos cancelados."
    );
    if (!confirmar) return;

    try {
      await updateOrdenEstado(id, "cancelado");
      // Quita de la lista de pendientes
      setOrdenes((prev) => prev.filter((o) => o.id !== id));
    } catch (err) {
      console.error("Error al cancelar pedido:", err);
      alert("Hubo un problema al cancelar el pedido.");
    }
  };

  if (cargando) return <p>Cargando pedidos...</p>;

  return (
    <div>
     

      <div className="ordenes-pendientes" >
        <h1>Pedidos Pendientes</h1>

        {ordenes.length === 0 ? (
          <p>No hay pedidos pendientes.</p>
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
                  <button className="btn-M-enviar" onClick={() => marcarEnviado(o.id)}>
                    Marcar como Enviado
                  </button>
                  <button className="btn-cancelar" onClick={() => cancelarPedido(o.id)}>
                    Cancelar pedido
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

export default OrdenesPendientes;
