import React from 'react';

function FiltroSeleccion({ cantidad, seleccionados, onToggle }) {
  const checked = cantidad > 0 && seleccionados === cantidad;

  return (
    <div className="filtro-seleccion">
      <input
        type="checkbox"
        id="selectAll"
        checked={checked}
        onChange={(e) => onToggle(e.target.checked)}
      />
      <label htmlFor="selectAll"> TODOS LOS ARTÍCULOS ({cantidad}) </label>
    </div>
  );
}

export default FiltroSeleccion;


