import React, { useEffect, useState } from 'react';
import { getProductos, updateProducto } from '../../Services/Servicios';
import { FaHeart } from 'react-icons/fa';
import './ProductosCatalogo.css';
import { Link } from 'react-router-dom';
import ModalAlert from '../../Components/ModalAlert/ModalAlert'; // ⚠️ Ajusta la ruta si es distinta

function ProductosCatalogo() {
  const [productos, setProductos] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  
  // ✅ Estados para el modal de alerta
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

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
      .catch(err => {
        console.error('Error cargando productos', err);
        setModalMsg('❌ Error al cargar productos');
        setModalOpen(true);
      });
  };

  const toggleFavorito = async (producto) => {
    if (!usuario) {
      setModalMsg('Debes iniciar sesión para guardar favoritos');
      setModalOpen(true);
      return;
    }

    const userId = usuario.id;
    const actual = producto.favoritoDe || [];
    let nuevoArray;

    if (actual.includes(userId)) {
      nuevoArray = actual.filter(u => u !== userId);
    } else {
      nuevoArray = [...actual, userId];
    }

    try {
      await updateProducto(producto.id, { favoritoDe: nuevoArray });
      cargarProductos();
      setModalMsg(
        actual.includes(userId)
          ? 'Producto eliminado de favoritos ✅'
          : 'Producto agregado a favoritos ✅'
      );
      setModalOpen(true);
    } catch (error) {
      console.error('Error actualizando favorito', error);
      setModalMsg('❌ Error al actualizar favoritos');
      setModalOpen(true);
    }
  };

  // ✅ Filtrar productos por nombre o descripción
  const productosFiltrados = productos.filter(p =>
    p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className='bodyPC'>
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>

      {/* 🔍 Barra de búsqueda */}
      <div className="busqueda-container">
        <input
          type="text"
          placeholder="Buscar producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="input-busqueda"
        />
      </div>

      <div className="catalogo-grid">
        {productosFiltrados.map(p => {
          const esFavorito = usuario
            ? p.favoritoDe?.includes(usuario.id)
            : false;

          return (
            <div className="producto-card" key={p.id}>
              <div className="imagen-container">
                <img src={p.foto} alt={p.nombre} />
                <div title={!usuario ? "Debes iniciar sesión para guardar favoritos" : ""}>
                  <button
                    className={`btn-heart ${esFavorito ? 'activo' : ''}`}
                    onClick={() => toggleFavorito(p)}
                    aria-label="Guardar en favoritos"
                    disabled={!usuario}  // ⬅️ deshabilita si no hay login
                  >
                    <FaHeart />
                  </button>
                </div>

                {/* ✨ Overlay con el botón Ver más ✨ */}
                <div className="overlay">
                  <Link to={`/producto/${p.id}`} className="btn-vermas">
                    Ver más
                  </Link>
                </div>
              </div>

              <h3>{p.nombre}</h3>
              <p className="precio">${p.precio}</p>
            </div>
          );
        })}
        {productosFiltrados.length === 0 && (
          <p>No hay productos que coincidan con la búsqueda.</p>
        )}
      </div>

      {/* ✅ Modal de alerta que reemplaza los alert() */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aviso"
        message={modalMsg}
      />
    </div>
    </div>
  );
}

export default ProductosCatalogo;

