import React, { useEffect, useState } from 'react';
import { getProductos, updateProducto } from '../../Services/Servicios';
import { FaHeart } from 'react-icons/fa';
import './ProductosCatalogo.css';

function ProductosCatalogo() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = () => {
    getProductos()
      .then(data => {
        const activos = data.filter(p => p.activo);
        setProductos(activos);
      })
      .catch(err => console.error('Error cargando productos', err));
  };

  const toggleFavorito = async (producto) => {
    try {
      await updateProducto(producto.id, { favorito: !producto.favorito });
      // Recargar lista para ver el cambio
      cargarProductos();
    } catch (error) {
      console.error('Error actualizando favorito', error);
    }
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      <div className="catalogo-grid">
        {productos.map(p => (
          <div className="producto-card" key={p.id}>
            <div className="imagen-container">
              <img src={p.foto} alt={p.nombre} />
              <button
                className={`btn-heart ${p.favorito ? 'activo' : ''}`}
                onClick={() => toggleFavorito(p)}
                aria-label="Guardar en favoritos"
              >
                <FaHeart />
              </button>
            </div>

            <h3>{p.nombre}</h3>
            <p className="precio">₡{p.precio}</p>
          </div>
        ))}
        {productos.length === 0 && <p>No hay productos activos en este momento.</p>}
      </div>
    </div>
  );
}

export default ProductosCatalogo;

