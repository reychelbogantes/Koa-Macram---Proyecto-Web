import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  getProductos,
  updateProducto,
  getCarritoPorUsuario,
  crearCarrito,
  updateCarrito
} from '../../Services/Servicios';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import './ProductoDetalle.css';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import ModalAlert from '../../Components/ModalAlert/ModalAlert'; // ⚠️ Ajusta la ruta si es distinta

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  // ✅ Estados para el modal de alerta
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    if (userData) setUsuario(JSON.parse(userData));

    getProductos().then(data => {
      const encontrado = data.find(p => String(p.id) === String(id));
      if (encontrado) {
        setProducto(encontrado);
        if (userData) {
          setEsFavorito(encontrado.favoritoDe?.includes(JSON.parse(userData).id));
        }
      }
    });
  }, [id]);

  if (!producto) return <p>Cargando producto...</p>;

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
      setEsFavorito(!esFavorito);
      setModalMsg(
        actual.includes(userId)
          ? 'Producto eliminado de favoritos ✅'
          : 'Producto agregado a favoritos ✅'
      );
      setModalOpen(true);
    } catch (error) {
      console.error('Error actualizando favorito', error);
      setModalMsg('Hubo un problema al actualizar favoritos ❌');
      setModalOpen(true);
    }
  };

  const agregarAlCarrito = async () => {
    if (!usuario) {
      setModalMsg('Debes iniciar sesión para agregar al carrito');
      setModalOpen(true);
      return;
    }

    try {
      const carrito = await getCarritoPorUsuario(usuario.id);

      if (!carrito) {
        await crearCarrito(usuario.id, producto.id, cantidad);
      } else {
        const productosActuales = [...carrito.productos];
        const existente = productosActuales.find(p => p.productoId === producto.id);

        if (existente) {
          existente.cantidad += cantidad;
        } else {
          productosActuales.push({ productoId: producto.id, cantidad });
        }

        await updateCarrito(carrito.id, productosActuales);
      }

      setModalMsg("Producto agregado al carrito ✅");
      setModalOpen(true);
    } catch (error) {
      console.error("Error agregando al carrito:", error);
      setModalMsg("No se pudo agregar al carrito ❌");
      setModalOpen(true);
    }
  };

  return (
    <div>
      <Navbar/>
      <br /><br /><br /><br />
      <div className="detalle-container">
        <div className="detalle-imagen">
          <img src={producto.foto} alt={producto.nombre} />
        </div>

        <div className="detalle-info">
          <h1>{producto.nombre}</h1>
          <p className="detalle-precio">${producto.precio}</p>
          <p className="detalle-descripcion">{producto.descripcion}</p>

          <div className="detalle-acciones">
            <Link to="/catalogo" className="btn-volver">Volver al catálogo</Link>

            <button
              className={`btn-heart-detallado ${esFavorito ? 'activo' : ''}`}
              onClick={() => toggleFavorito(producto)}
              aria-label="Guardar en favoritos"
            >
              <FaHeart />
            </button>

            <button className="btn-agregar1" onClick={agregarAlCarrito}>
              <FaShoppingCart />
            </button>

            <div className="agregar-carrito">
              <input
                type="number"
                min="1"
                value={cantidad}
                onChange={e => setCantidad(parseInt(e.target.value))}
              />
            </div>
          </div>
        </div>
      </div>
      <Footer/>

      {/* ✅ Modal de alerta que reemplaza todos los alert() */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aviso"
        message={modalMsg}
      />
    </div>
  );
}

export default ProductoDetalle;

