import React from "react";
import { Link } from "react-router-dom";   // ➡️ IMPORTANTE
import "./PerfilModal.css";

function PerfilModal({ isOpen, onClose, usuario, onPerdidos }) {
  if (!isOpen) return null;

  const hayUsuario = Boolean(usuario && usuario.name); // o el campo real que uses

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
              <h2><strong>Perfil: <br /></strong> {usuario.name}</h2>

              <div className="perfil-actions">
                <button className="perfil-btn" onClick={onPerdidos}>
                  Perdidos
                </button>
              </div>
            </>
          ) : (
            <div className="perfil-actions">
              <p>No has iniciado sesión</p>
              {/* 🔗 Link que redirige a /login */}
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
