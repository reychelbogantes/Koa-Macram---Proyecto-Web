import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {getProductos, updateProducto, getCarritoPorUsuario, crearCarrito, updateCarrito } from '../../Services/Servicios';
import { FaHeart, FaShoppingCart } from 'react-icons/fa';
import './ProductoDetalle.css';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';

function ProductoDetalle() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [esFavorito, setEsFavorito] = useState(false);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    if (userData) setUsuario(JSON.parse(userData));

    getProductos().then(data => {
      console.log('Productos:', data); // 👈 para verificar
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
       setEsFavorito(!esFavorito);  // ✅ actualiza el corazón
    } catch (error) {
       console.error('Error actualizando favorito', error);
    }
  };

  const agregarAlCarrito = async () => {
  if (!usuario) {
    alert('Debes iniciar sesión para agregar al carrito');
    return;
  }

  try {
    // 1. Buscar si el usuario ya tiene un carrito
    const carrito = await getCarritoPorUsuario(usuario.id);

    if (!carrito) {
      // 2. Si no existe, crear uno nuevo
      await crearCarrito(usuario.id, producto.id, cantidad);
    } else {
      // 3. Si existe, revisar si el producto ya está en el carrito
      const productosActuales = [...carrito.productos];
      const existente = productosActuales.find(p => p.productoId === producto.id);

      if (existente) {
        // aumentar cantidad
        existente.cantidad += cantidad;
      } else {
        // agregar nuevo producto
        productosActuales.push({ productoId: producto.id, cantidad });
      }

      await updateCarrito(carrito.id, productosActuales);
    }

    alert("Producto agregado al carrito ✅");
  } catch (error) {
    console.error("Error agregando al carrito:", error);
    alert("No se pudo agregar al carrito");
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

              {/* === Nuevo bloque === */}
            <div className="agregar-carrito">
             <input type="number" min="1" value={cantidad} onChange={e => setCantidad(parseInt(e.target.value))} />
            </div>
            




        </div>







      </div>
    </div>
    <Footer/>
    </div>
  );
}

export default ProductoDetalle;

