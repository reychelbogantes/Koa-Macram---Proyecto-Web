import React, { useEffect, useState } from 'react';
import './Carrito.css';

import FiltroSeleccion from '../../Components/ComponentsCarrito/FiltroSeleccion';
import ListaProductos from '../../Components/ComponentsCarrito/ListaProductos';
import ResumenPedido from '../../Components/ComponentsCarrito/ResumenPedido';
import MetodosPago from '../../Components/ComponentsCarrito/MetodosPago';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import ModalAlert from '../../Components/ModalAlert/ModalAlert';

import UbicacionesUsuario from '../../Components/ComponentsCarrito/UbicacionesUsuario';

import {
  getCarritoPorUsuario,
  getProductos,
  updateCarrito,
  updateProducto
} from '../../Services/Servicios';

function Carrito() {
  // --- Favicon y título dinámicos
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = `${import.meta.env.BASE_URL}logo.png`;
    document.title = "Mi carrito | Koa Macramé";
  }, []);

  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [carritoId, setCarritoId] = useState(null);   // ✅ id REAL del carrito

  // Modal de alerta
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  const productosSeleccionados = productosCarrito.filter(p => seleccionados.includes(p.id));

  // --- Cargar usuario y carrito
  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    if (!userData) {
      setModalMsg('Debes iniciar sesión para ver tu carrito.');
      setModalOpen(true);
      return;
    }

    const u = JSON.parse(userData);
    setUsuario(u);

    getCarritoPorUsuario(u.id)
      .then(async c => {
        if (!c || !c.productos || c.productos.length === 0) {
          setModalMsg('Tu carrito está vacío.');
          setModalOpen(true);
          return;
        }

        const allProducts = await getProductos();
        const lista = c.productos
          .map(item => {
            const prod = allProducts.find(p => p.id === item.productoId);
            return prod ? { ...prod, cantidad: item.cantidad } : null;
          })
          .filter(Boolean);

        setCarritoId(c.id);           // ✅ guardamos el id del carrito
        setProductosCarrito(lista);
        setSeleccionados([]);
      })
      .catch(err => {
        console.error("Error al cargar carrito", err);
        setModalMsg('Hubo un problema cargando el carrito.');
        setModalOpen(true);
      });
  }, []);

  // --- Seleccionar / deseleccionar todos
  const handleSelectAll = (checked) => {
    setSeleccionados(checked ? productosCarrito.map(p => p.id) : []);
  };

  // --- Seleccionar / deseleccionar uno
  const handleSelectOne = (id, checked) => {
    setSeleccionados(prev => checked ? [...prev, id] : prev.filter(pid => pid !== id));
  };

  // --- Cambiar cantidad de un producto
  const handleCantidadChange = async (idProducto, nuevaCantidad) => {
    setProductosCarrito(prev =>
      prev.map(p => p.id === idProducto ? { ...p, cantidad: nuevaCantidad } : p)
    );

    if (carritoId) {
      const nuevosProductos = productosCarrito.map(p =>
        p.id === idProducto
          ? { productoId: p.id, cantidad: nuevaCantidad }
          : { productoId: p.id, cantidad: p.cantidad }
      );
      await updateCarrito(carritoId, nuevosProductos);
    }
  };

  // --- Eliminar producto del carrito
  const handleEliminar = async (idProducto) => {
    const nuevos = productosCarrito.filter(p => p.id !== idProducto);
    setProductosCarrito(nuevos);
    setSeleccionados(sel => sel.filter(pid => pid !== idProducto));

    if (carritoId) {
      const nuevosProductos = nuevos.map(p => ({ productoId: p.id, cantidad: p.cantidad }));
      await updateCarrito(carritoId, nuevosProductos);
    }
  };

  // --- Pasar a favoritos
  const handleFavorito = async (producto) => {
    if (!usuario) {
      setModalMsg('Debes iniciar sesión para guardar favoritos');
      setModalOpen(true);
      return;
    }
    const userId = usuario.id;
    const actual = producto.favoritoDe || [];
    const nuevoArray = actual.includes(userId)
      ? actual.filter(u => u !== userId)
      : [...actual, userId];

    try {
      await updateProducto(producto.id, { favoritoDe: nuevoArray });
      setModalMsg(
        actual.includes(userId)
          ? 'Producto eliminado de favoritos ✅'
          : 'Producto guardado en favoritos ✅'
      );
      setModalOpen(true);
    } catch (error) {
      console.error("Error al actualizar favoritos", error);
      setModalMsg('❌ Hubo un problema al guardar en favoritos');
      setModalOpen(true);
    }
  };

  return (
    <div>
      <Navbar/>
      <br /><br /><br /><br />

      <div className="carrito-container">
        <div className="carrito-left">
          <FiltroSeleccion
            cantidad={productosCarrito.length}
            seleccionados={seleccionados.length}
            onToggle={handleSelectAll}
          />
          <ListaProductos
            productos={productosCarrito}
            seleccionados={seleccionados}
            onToggleOne={handleSelectOne}
            onCantidadChange={handleCantidadChange}
            onEliminar={handleEliminar}
            onFavorito={handleFavorito}
          />
          <UbicacionesUsuario onSeleccion={setDireccionSeleccionada}/>
        </div>

        <div className="carrito-right">
          <ResumenPedido
            productos={productosSeleccionados}
            tipoEnvio={direccionSeleccionada?.metodoEnvio}
            setCarrito={setProductosCarrito}
            seleccionados={seleccionados}
            carritoId={carritoId}   // ✅ pasamos el id del carrito
          />
          <MetodosPago />
        </div>
      </div>
      <Footer />

      {/* Modal de alerta */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aviso"
        message={modalMsg}
      />
    </div>
  );
}

export default Carrito;
