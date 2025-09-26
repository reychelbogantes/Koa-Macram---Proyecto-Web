import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOrdenes } from "../../Services/Servicios";  // ✅ para obtener notificaciones reales
import "./PerfilModal.css";

function PerfilModal({ isOpen, onClose, usuario }) {
  if (!isOpen) return null;

  const navigate = useNavigate();
  const [hayNotificacionNueva, setHayNotificacionNueva] = useState(false);
  const hayUsuario = Boolean(usuario && usuario.name);

  useEffect(() => {
    async function verificarNotificaciones() {
      if (!usuario?.email) return;

      const ordenes = await getOrdenes();
      // Filtra solo las órdenes de este usuario
      const misOrdenes = ordenes.filter(o => o.usuario?.email === usuario.email);
      if (misOrdenes.length === 0) return;

      // ✅ Busca la fecha más reciente de cualquier cambio en el historial
    const todasFechasHistorial = misOrdenes.flatMap(o =>
       (o.historial || []).map(h => new Date(h.fecha).getTime())
     );
    if (todasFechasHistorial.length === 0) return;

    const ultimaFecha = new Date(Math.max(...todasFechasHistorial));

    // ✅ Fecha guardada de la última vez que el usuario abrió las notificaciones
     const ultimaVista = localStorage.getItem("ultimaVistaNotificaciones");
     const ultimaVistaDate = ultimaVista ? new Date(ultimaVista) : null;

    // ✅ Si no hay registro de última vista o la última notificación es posterior
     if (!ultimaVistaDate || ultimaFecha > ultimaVistaDate) {
       setHayNotificacionNueva(true);
    }
   }

   verificarNotificaciones();
   // Opcional: refrescar cada 10s para detectar nuevas notificaciones en tiempo real
   const intervalo = setInterval(verificarNotificaciones, 10000);
   return () => clearInterval(intervalo);
  }, [usuario]);

  const irANotificaciones = () => {
    // ✅ Guardamos la fecha actual como última vez que se vio la página
    localStorage.setItem("ultimaVistaNotificaciones", new Date().toISOString());
    setHayNotificacionNueva(false); // Oculta el punto rojo
    onClose();
    navigate("/mis-notificaciones");
  };

  return (
    <div className="perfil-overlay" onClick={onClose}>
      <div
        className="perfil-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <button className="perfil-close" onClick={onClose}>
          ×
        </button>

        <div className="perfil-info">
          {hayUsuario ? (
            <>
              <h2>{usuario.name}</h2>
              <hr />

              <button className="perfil-btn" onClick={irANotificaciones}>
                🔔 Mis Notificaciones{" "}
                {hayNotificacionNueva && (
                  <span className="perfil-notif-dot"></span>
                )}
              </button>

              <div className="perfil-actions">
                <button
                  className="perfil-btn"
                  onClick={() => {
                    onClose();
                    navigate("/mis-pedidos");
                  }}
                >
                  🛍️ Mis pedidos
                </button>
              </div>
            </>
          ) : (
            <div className="perfil-actions">
              <p>No has iniciado sesión</p>
              <Link
                to="/login"
                className="perfil-btn perfil-login-link"
                onClick={onClose}
              >
                Iniciar sesión
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PerfilModal;
