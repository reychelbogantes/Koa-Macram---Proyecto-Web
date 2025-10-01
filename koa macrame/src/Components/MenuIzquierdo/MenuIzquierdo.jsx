import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MenuIzquierdo.css';

function MenuIzquierdo() {
  const [openMenu, setOpenMenu] = useState(false);

  // Submenús
  const [openProductos, setOpenProductos] = useState(false);
  const [openUsuarios, setOpenUsuarios] = useState(false);
  const [openPedidos, setOpenPedidos] = useState(false);

  // 🔹 Función para cerrar menú al hacer clic en cualquier link
  const handleCloseMenu = () => setOpenMenu(false);

  return (
    <>
      {/* Botón hamburguesa */}
      <button className="menu-toggle" onClick={() => setOpenMenu(!openMenu)}>
        ☰
      </button>

      {/* Menú lateral */}
      <aside className={`menu-izquierdo ${openMenu ? 'open' : ''}`}>
        <div className="menu-header">
          <br /> <br />
          <Link className="menu-header" to="/admin" onClick={handleCloseMenu}>
            Admin
          </Link>
        </div>

        <nav className="menu-links">
          <Link to="." onClick={handleCloseMenu}>📊 Estadísticas</Link>

          {/* Usuarios */}
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
                <Link to="usuarios-admin" onClick={handleCloseMenu}>👤 Usuarios Admin</Link>
                <Link to="usuarios" onClick={handleCloseMenu}>👥 Usuarios Clientes</Link>
              </div>
            )}
          </div>

          {/* Pedidos */}
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
                <Link to="ordenes-pendientes" onClick={handleCloseMenu}>‼️ Nuevos Pedidos</Link>
                <Link to="ordenes-finalizadas" onClick={handleCloseMenu}>✔️ Pedidos finalizados</Link>
                <Link to="ordenes-canceladas" onClick={handleCloseMenu}>❌ Pedidos Cancelados</Link>
              </div>
            )}
          </div>

          <Link to="facturas" onClick={handleCloseMenu}>🪙 Facturación</Link>

          {/* Productos */}
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
                <Link to="productos" onClick={handleCloseMenu}>➕ Ingresar nuevo</Link>
                <Link to="inventario" onClick={handleCloseMenu}>📦 Inventario</Link>
              </div>
            )}
          </div>

          <Link to="buzon" onClick={handleCloseMenu}>📬 Buzón de Contacto</Link>
        </nav>

        <div className="menu-footer">
          <button className="logout-btn">
            <Link to="/login" onClick={handleCloseMenu}>🚪 Cerrar sesión</Link>
          </button>
        </div>
        <br /><br />
      </aside>

      {/* Overlay oscuro */}
      {openMenu && <div className="overlay" onClick={handleCloseMenu} />}
    </>
  );
}

export default MenuIzquierdo;
