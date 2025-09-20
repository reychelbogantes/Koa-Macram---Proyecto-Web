import React from 'react'
import { Link } from "react-router-dom";
import logo from "/logoK.png"; // ⬅️ tu logo en /assets
import { FaShoppingCart, FaUser, FaHeart } from "react-icons/fa";



import './Navbar.css';
function Navbar() {
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
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/catalogo">Catálogo</Link></li>
        <li><Link to="/pedidos">Pedidos personalizados</Link></li>
        <li><Link to="/contacto">Contáctanos</Link></li>
      </ul>

      {/* --- Iconos a la derecha --- */}
      <div className="navbar-icons">
        <Link to="/carrito"><FaShoppingCart /></Link>
        <Link to="/"><FaHeart/></Link>
        <Link to="/"><FaUser /></Link>
      </div>
    </nav>

    </div>
  )
}

export default Navbar