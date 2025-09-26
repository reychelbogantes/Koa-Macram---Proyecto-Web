import React, { useEffect, useState } from "react";
import { getOrdenes } from "../../Services/Servicios";
import "./MisNotificaciones.css";

function MisNotificaciones({ usuario }) {
  const [notificaciones, setNotificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  async function cargarNotificaciones() {
    try {
      const ordenes = await getOrdenes();

      const misNotifs = ordenes
        .filter(o => o.usuario?.email === usuario.email)
        .flatMap(o =>
          (o.historial || []).map(h => {
            let mensaje;
            switch (h.estado.toLowerCase()) {
              case "pendiente":
                mensaje = `Pedido ${o.id}: Tu pedido ha sido recibido por el administrador.`;
                break;
              case "enviado":
                mensaje = `Pedido ${o.id}: ¡Buenas noticias! Tu pedido ha sido enviado.`;
                break;
              case "cancelado":
                mensaje = `Pedido ${o.id}: Lamentamos informarte que tu pedido ha sido cancelado.`;
                break;
              default:
                mensaje = `Pedido ${o.id}: Actualización de tu pedido.`;
            }
            return {
              id: `${o.id}-${h.estado}-${h.fecha}`,
              fecha: h.fecha,
              mensaje,
              estado: h.estado
            };
          })
        )
        .sort((a,b) => new Date(b.fecha) - new Date(a.fecha));

      setNotificaciones(misNotifs);
    } catch (err) {
      console.error("Error cargando notificaciones:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!usuario?.email) return;
    cargarNotificaciones();
    const interval = setInterval(cargarNotificaciones, 10000);
    return () => clearInterval(interval);
  }, [usuario]);

  if (!usuario) return <p>Debes iniciar sesión para ver tus notificaciones.</p>;
  if (loading) return <p>Cargando notificaciones...</p>;

  return (
    <div className="mis-notificaciones">
      <h2>🔔 Mis Notificaciones</h2>
      {notificaciones.length === 0 ? (
        <p>No tienes notificaciones en este momento.</p>
      ) : (
        <ul className="lista-notificaciones">
          {notificaciones.map(n => (
            <li key={n.id} className={`notif notif-${n.estado.toLowerCase()}`}>
              <div className="notif-mensaje">{n.mensaje}</div>
              <div className="notif-fecha">{new Date(n.fecha).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisNotificaciones;
