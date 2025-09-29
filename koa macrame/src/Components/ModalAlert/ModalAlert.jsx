import React from 'react';
import './ModalAlert.css';

function ModalAlert({ isOpen, onClose, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-alert" onClick={e => e.stopPropagation()}>
        <h2>{title}</h2>
        <p> {message}</p>
        <button className="modal-button" onClick={onClose}>Aceptar</button>
      </div>
    </div>
  );
}

export default ModalAlert;
