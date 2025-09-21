import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import logo from "/logoK.png";
import { FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";
import FavoritosModal from '../FavoritosModal/FavoritosModal';



import './Navbar.css';
function Navbar() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    if (userData) setUsuario(JSON.parse(userData));
  }, []);

   const abrirModal = () => {
    const userData = localStorage.getItem("usuarioLogueado");
    setUsuario(userData ? JSON.parse(userData) : null);
    setModalAbierto(true);
  };


  return (
    <div>
      <nav className="navbar">
      {/* --- Logo --- */}
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo Koa Macramé" />
        </Link>
      </div>

      {/* --- Enlaces de navegación --- */}
      <ul className="navbar-links">
        <li><Link to="/homepage">Inicio</Link></li>
        <li><Link to="/catalogo">Catálogo</Link></li>
        <li> <HashLink smooth to="/homepage#pedidos-personalizados">Pedidos personalizados</HashLink></li>
        <li><Link to="/contacto">Contáctanos</Link></li>
      </ul>

        {/* --- Iconos a la derecha --- */}
        <div className="navbar-icons">
          <Link to="/carrito"><FaShoppingCart /></Link>

          {/* Corazón que abre el modal */}
          <button className="btn-heart-nav" onClick={abrirModal} >
            <FaHeart />
          </button>

          <Link to="/"><FaUser /></Link>
           </div>
           </nav>

        {/* Modal de favoritos */}
        <FavoritosModal isOpen={modalAbierto} onClose={() => setModalAbierto(false)} usuario={usuario} />
    </div>
    
  );
}

export default Navbar