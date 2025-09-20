import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuIzquierdo.css';

function MenuIzquierdo() {
    const [openProductos, setOpenProductos] = useState(false);

  return (
      <aside className="menu-izquierdo">
      <div className="menu-header">
        <br /> <br />
        <Link className="menu-header" to="/admin">Admin</Link>
      </div>

      <nav className="menu-links">
        <Link to="/admin/dashboard">📊 Dashboard</Link>
        <Link to="/usuarios">👥 Usuarios</Link>

        {/* Sección Productos con sub-opciones */}
        <div className="submenu">
          <button
            type="button"
            className="submenu-toggle"
            onClick={() => setOpenProductos(!openProductos)}
          >
            🛍 Productos {openProductos ? '▲' : '▼'}
          </button>

          {openProductos && (
            <div className="submenu-items">
              <Link to="/productosadmin">➕ Ingresar nuevo</Link>
              <Link to="/inventario">📦 Inventario</Link>
            </div>
          )}
        </div>

        <Link to="/admin/configuracion">⚙️ Configuración</Link>
      </nav>

      <div className="menu-footer">
        <button className="logout-btn"><Link to="/login">🚪 Cerrar sesión</Link></button>
      </div>
      <br /><br />

    </aside>
  );
}

export default MenuIzquierdo;
