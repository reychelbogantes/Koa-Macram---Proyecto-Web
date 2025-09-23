import React, { useEffect, useState } from 'react';
import './Carrito.css';

import FiltroSeleccion from '../../Components/ComponentsCarrito/FiltroSeleccion';
import ListaProductos from '../../Components/ComponentsCarrito/ListaProductos';
import ResumenPedido from '../../Components/ComponentsCarrito/ResumenPedido';
import MetodosPago from'../../Components/ComponentsCarrito/MetodosPago';
import Navbar from '../../Components/NavBar/Navbar'
import Footer from '../../Components/Footer/Footer'

import UbicacionesUsuario from '../../Components/ComponentsCarrito/UbicacionesUsuario';


import { getCarritoPorUsuario, getProductos, updateCarrito, updateProducto, guardarDireccionUsuario } from '../../Services/Servicios';



function Carrito() {
  const [direccionSeleccionada, setDireccionSeleccionada] = useState(null);
  const [productosCarrito, setProductosCarrito] = useState([]);
  const [seleccionados, setSeleccionados] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [carritoId, setCarritoId] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    if (userData) {
      const u = JSON.parse(userData);
      setUsuario(u);

      getCarritoPorUsuario(u.id).then(async c => {
        if (c) {
          setCarritoId(c.id);
          const allProducts = await getProductos();
          const lista = c.productos.map(item => {
            const prod = allProducts.find(p => p.id === item.productoId);
            return prod ? { ...prod, cantidad: item.cantidad } : null;
          }).filter(Boolean);

          setProductosCarrito(lista);
          setSeleccionados([]);
        }
      });
    }
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

    // Actualiza en db.json
    if (carritoId) {
      const nuevosProductos = productosCarrito.map(p =>
        p.id === idProducto ? { productoId: p.id, cantidad: nuevaCantidad } :
                              { productoId: p.id, cantidad: p.cantidad }
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
      alert('Debes iniciar sesión para guardar favoritos');
      return;
    }
    const userId = usuario.id;
    const actual = producto.favoritoDe || [];
    const nuevoArray = actual.includes(userId)
      ? actual.filter(u => u !== userId)
      : [...actual, userId];
    await updateProducto(producto.id, { favoritoDe: nuevoArray });
    alert("Producto guardado en favoritos");
  };

  const productosSeleccionados = productosCarrito.filter(p => seleccionados.includes(p.id));

  if (!usuario) return <p>Debes iniciar sesión para ver tu carrito.</p>;
  if (!productosCarrito.length) return <p>Tu carrito está vacío.</p>;
   
  const handleEnvio = async (datos) => {
    try {
      const userData = localStorage.getItem("usuarioLogueado");
      if (!userData) {
        alert("Debes iniciar sesión para guardar la dirección.");
        return;
      }
      const usuario = JSON.parse(userData);

      // Llamamos al servicio pasando el id del usuario y los datos del formulario
      await guardarDireccionUsuario(usuario.id, datos);
      alert("✅ Dirección guardada correctamente en la base de datos");
    } catch (error) {
      alert("❌ Ocurrió un error al guardar la dirección");
      console.error(error);
    }
  };


  return (
    <div>
    <Navbar/>
    <br />
    <br />
    <br />
    <br />

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
        <ResumenPedido productos={productosSeleccionados}
        tipoEnvio={direccionSeleccionada?.metodoEnvio} />
        <MetodosPago />
      </div>
    </div>
    <Footer />


    </div>
  );
}

export default Carrito;

