import React from 'react';
import { FaHeart, FaTrash } from 'react-icons/fa';

function ListaProductos({
  productos,
  seleccionados,
  onToggleOne,
  onCantidadChange,
  onEliminar,
  onFavorito
}) {
  return (
    <div className="lista-productos">
      {productos.map(p => (
        <div key={p.id} className="producto-item">
          <input
            type="checkbox"
            checked={seleccionados.includes(p.id)}
            onChange={(e) => onToggleOne(p.id, e.target.checked)}
          />

          <img src={p.foto} alt={p.nombre}/>
          <div className="info">
            <h4>{p.nombre}</h4>
            <p className="precio">₡{p.precio}</p>
          </div>
          
<div className="acciones">
  <label>Cantidad:</label>

  <div className="cantidad-wrapper">
    <button
      type="button"
      className="btn-cantidad"
      onClick={() => onCantidadChange(p.id, Math.max(1, p.cantidad - 1))}
    >
      -
    </button>

    <input
      type="number"
      min="1"
      value={p.cantidad}
      onChange={(e) =>
        onCantidadChange(p.id, Math.max(1, parseInt(e.target.value) || 1))
      }
    />

    <button
      type="button"
      className="btn-cantidad"
      onClick={() => onCantidadChange(p.id, p.cantidad + 1)}
    >
      +
    </button>
  </div>
</div>


          <div className="botones-extra">
            <button
              className="btn-favorito"
              onClick={() => onFavorito(p)}
              title="Pasar a favoritos"
            >
              <FaHeart />
            </button>

            <button
              className="btn-eliminar"
              onClick={() => onEliminar(p.id)}
              title="Eliminar del carrito"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ListaProductos;

