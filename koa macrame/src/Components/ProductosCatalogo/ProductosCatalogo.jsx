import React, { useEffect, useState } from 'react';
import { getProductos, updateProducto } from '../../Services/Servicios';
import { FaHeart } from 'react-icons/fa';
import './ProductosCatalogo.css';
import { Link } from 'react-router-dom'; 


function ProductosCatalogo() {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    cargarProductos();
    const userData = localStorage.getItem("usuarioLogueado");
    if (userData) setUsuario(JSON.parse(userData));
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
    if (!usuario) {
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }

    const userId = usuario.id;   // 🔑 Usar id único del usuario
    const actual = producto.favoritoDe || [];
    let nuevoArray;

    if (actual.includes(userId)) {
      // Quitar de favoritos
      nuevoArray = actual.filter(u => u !== userId);
    } else {
      // Agregar a favoritos
      nuevoArray = [...actual, userId];
    }

    try {
      await updateProducto(producto.id, { favoritoDe: nuevoArray });
      cargarProductos();
    } catch (error) {
      console.error('Error actualizando favorito', error);
    }
  };

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      <div className="catalogo-grid">
        {productos.map(p => {
          const esFavorito = usuario
            ? p.favoritoDe?.includes(usuario.id)
            : false;

          return (
<div className="producto-card" key={p.id}>
  <div className="imagen-container">
    <img src={p.foto} alt={p.nombre} />
    <button
      className={`btn-heart ${esFavorito ? 'activo' : ''}`}
      onClick={() => toggleFavorito(p)}
      aria-label="Guardar en favoritos"
    >
      <FaHeart />
    </button>

    {/* ✨ Overlay con el botón Ver más ✨ */}
    <div className="overlay">
      <Link to={`/producto/${p.id}`} className="btn-vermas">
        Ver más
      </Link>
    </div>
  </div>

  <h3>{p.nombre}</h3>
  <p className="precio">₡{p.precio}</p>
</div>
          );
        })}
        {productos.length === 0 && (
          <p>No hay productos activos en este momento.</p>
        )}
      </div>
    </div>
  );
}

export default ProductosCatalogo;
