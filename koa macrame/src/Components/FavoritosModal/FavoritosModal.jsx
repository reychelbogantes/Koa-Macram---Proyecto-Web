import React, { useEffect, useState } from 'react';
import { getFavoritosPorUsuario } from '../../Services/Servicios';
import './FavoritosModal.css';

function FavoritosModal({ isOpen, onClose, usuario }) {
  const [favoritos, setFavoritos] = useState([]);

  useEffect(() => {
    if (isOpen && usuario) {
      // ✅ Tomamos el id del usuario logueado
      getFavoritosPorUsuario(usuario.id)
        .then(setFavoritos)
        .catch(console.error);
    }
  }, [isOpen, usuario]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {!usuario ? (
          <div className="modal-msg">
            <h2>Favoritos</h2>
            <p>
              Para ver y guardar favoritos debes
              <a href="/login"> iniciar sesión</a> o
              <a href="/registro"> registrarte</a>.
            </p>
          </div>
        ) : (
          <div>
            <h2>Mis favoritos</h2>
            {favoritos.length === 0 ? (
              <p>No tienes productos favoritos todavía.</p>
            ) : (
              <ul className="lista-favoritos">
                {favoritos.map(p => (
                  <li key={p.id}>
                    <img src={p.foto} alt={p.nombre} />
                    <span>{p.nombre} – ${p.precio}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default FavoritosModal;

