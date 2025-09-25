import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuIzquierdo.css';

function MenuIzquierdo() {
    const [openProductos, setOpenProductos] = useState(false);
    const [openUsuarios, setOpenUsuarios] = useState(false);
    const [openPedidos, setOpenPedidos] = useState(false);

  return (
      <aside className="menu-izquierdo">
      <div className="menu-header">
        <br /> <br />
        <Link className="menu-header" to="/admin">Admin</Link>
      </div>

      <nav className="menu-links">
        <Link to=".">📊 Estadísticas</Link>

         {/* Sección Usuarios con sub-opciones */}
         <div className="submenu">
          <button
            type="button"
            className="submenu-toggle"
            onClick={() => setOpenUsuarios(!openUsuarios)}
          >
            👥 Usuarios {openUsuarios ? '🔺' : '🔻'}
          </button>

          {openUsuarios && (
            <div className="submenu-items">
              <Link to="/productosadmin">👤 Usuarios Admin</Link>
              <Link to="usuarios">👥 Usuarios Clientes</Link>
            </div>
          )}
        </div>

          {/* Sección Pedidos con sub-opciones */}
        <div className="submenu">
          <button
            type="button"
            className="submenu-toggle"
            onClick={() => setOpenPedidos(!openPedidos)}
          >
            🛎️ Pedidos {openPedidos ? '🔺' : '🔻'}
          </button>

          {openPedidos && (
            <div className="submenu-items">
              <Link to="ordenes-pendientes">‼️Nuevos Pedidos</Link>
              <Link to="ordenes-finalizadas">✔️ Pedidos finalizados</Link>
              <Link to="ordenes-canceladas">❌ Pedidos Cancelados</Link>
            </div>
          )}
        </div>
    
        <Link to="facturas">🪙 Facturación</Link>

        {/* Sección Productos con sub-opciones */}
        <div className="submenu">
          <button
            type="button"
            className="submenu-toggle"
            onClick={() => setOpenProductos(!openProductos)}
          >
            🛍️ Productos {openProductos ? '🔺' : '🔻'}
          </button>

          {openProductos && (
            <div className="submenu-items">
              <Link to="productos">➕ Ingresar nuevo</Link>
              <Link to="inventario">📦 Inventario</Link>
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
