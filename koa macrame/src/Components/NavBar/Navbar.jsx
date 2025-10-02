import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { HashLink } from 'react-router-hash-link';
import logo from "/logoK.png";
import { FaShoppingCart, FaUser, FaHeart, FaEllipsisH, FaTimes } from "react-icons/fa";
import FavoritosModal from '../FavoritosModal/FavoritosModal';
import PerfilModal from '../PerfilModal/PerfilModal';
import './Navbar.css';

function Navbar() {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false); // 🔥 estado menú mobile

  useEffect(() => {
    const loadUser = () => {
      const data = localStorage.getItem("usuarioLogueado");
      setUsuario(data ? JSON.parse(data) : null);
    };
    loadUser();
    window.addEventListener("storage", loadUser);
    return () => window.removeEventListener("storage", loadUser);
  }, []);

  const abrirModal = () => {
    const userData = localStorage.getItem("usuarioLogueado");
    setUsuario(userData ? JSON.parse(userData) : null);
    setModalAbierto(true);
  };

  const abrirPerfil = () => {
    const userData = localStorage.getItem("usuarioLogueado");
    setUsuario(userData ? JSON.parse(userData) : null);
    setPerfilAbierto(true);
  };

  return (
    <div>
      <nav className="navbar">
        {/* Logo */}
        <div className="navbar-logo">
          <Link to="/">
            <img src={logo} alt="Logo Koa Macramé" />
          </Link>
        </div>

        {/* Botón hamburguesa */}
        <button
          className="menu-toggle-I"
          onClick={() => setMenuAbierto(!menuAbierto)}
        >
          {menuAbierto ? <FaTimes /> : <FaEllipsisH />}
        </button>

        {/* Enlaces */}
        <ul className={`navbar-links ${menuAbierto ? "open" : ""}`}>
          <li><Link to="/homepage" onClick={() => setMenuAbierto(false)}>Inicio</Link></li>
          <li><Link to="/catalogo" onClick={() => setMenuAbierto(false)}>Catálogo</Link></li>
          <li><HashLink smooth to="/homepage#pedidos-personalizados" onClick={() => setMenuAbierto(false)}>Pedidos personalizados</HashLink></li>
          <li><Link to="/contacto" onClick={() => setMenuAbierto(false)}>Contáctanos</Link></li>
        </ul>

        {/* Iconos */}
        <div className="navbar-icons">
          <Link to="/carrito"><FaShoppingCart /></Link>
          <button className="btn-heart-nav" onClick={abrirModal}><FaHeart /></button>
          <button className="btn-heart-nav" onClick={abrirPerfil}><FaUser /></button>
        </div>
      </nav>

      {/* Modal favoritos */}
      <FavoritosModal
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        usuario={usuario}
      />

      {/* Modal perfil */}
      <PerfilModal
        isOpen={perfilAbierto}
        onClose={() => setPerfilAbierto(false)}
        usuario={usuario}
      />
    </div>
  );
}

export default Navbar;
