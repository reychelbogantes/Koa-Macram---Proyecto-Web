import React, { useEffect, useState } from "react";
import { getAdmins, createAdmin, updateAdmin } from "../../Services/Servicios";

import './UsuariosAdminAdmin.css';

function UsuariosAdminAdmin() {
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [nuevoAdmin, setNuevoAdmin] = useState({ name: "", email: "", password: "" });
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ name: "", email: "" });

  useEffect(() => { cargarAdmins(); }, []);

  async function cargarAdmins() {
    const data = await getAdmins();
    setUsuariosAdmin(data);
  }

  async function crearAdmin(e) {
    e.preventDefault();
    if (!nuevoAdmin.name || !nuevoAdmin.email || !nuevoAdmin.password) return;
    await createAdmin(nuevoAdmin);
    setNuevoAdmin({ name: "", email: "", password: "" });
    cargarAdmins();
  }

  function empezarEdicion(u) {
    setEditando(u.id);
    setFormEdit({ name: u.name, email: u.email });
  }

  async function guardarEdicion(id) {
    await updateAdmin(id, { name: formEdit.name, email: formEdit.email });
    setEditando(null);
    cargarAdmins();
  }

  return (
    <div className="usuarios-admin-container" style={{ padding: "2rem" }}>
      <h2>👥 Administrar Usuarios Administrativos</h2>

      {/* Crear nuevo admin */}
      <form className="form-crear-admin"  onSubmit={crearAdmin} style={{
        marginBottom: "2rem", background: "#f4f4f8",
        padding: "1rem", borderRadius: "8px"
      }}>
        <h3>Crear nuevo administrador</h3>
        <input type="text" placeholder="Nombre" value={nuevoAdmin.name}
          onChange={e => setNuevoAdmin({ ...nuevoAdmin, name: e.target.value })} required />
        <input type="email" placeholder="Correo" value={nuevoAdmin.email}
          onChange={e => setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })} required />
        <input type="password" placeholder="Contraseña" value={nuevoAdmin.password}
          onChange={e => setNuevoAdmin({ ...nuevoAdmin, password: e.target.value })} required />
        <button type="submit">➕ Crear Admin</button>
      </form>

      {/* Lista de administradores */}
      <table className="tabla-usuarios-admin" style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#839252", color: "#fff" }}>
            <th style={{ padding: "10px" }}>Nombre</th>
            <th>Correo</th>
            <th>Fecha Registro</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuariosAdmin.map(u => (
            <tr key={u.id} style={{ borderBottom: "1px solid #ddd" }}>
              <td>
                {editando === u.id ? (
                  <input value={formEdit.name}
                    onChange={e => setFormEdit({ ...formEdit, name: e.target.value })} />
                ) : u.name}
              </td>
              <td>
                {editando === u.id ? (
                  <input value={formEdit.email}
                    onChange={e => setFormEdit({ ...formEdit, email: e.target.value })} />
                ) : u.email}
              </td>
              <td>{new Date(u.fechaRegistro).toLocaleDateString()}</td>
              <td>
                {editando === u.id ? (
                  <button onClick={() => guardarEdicion(u.id)}>💾 Guardar</button>
                ) : (
                  <button onClick={() => empezarEdicion(u)}>✏️ Editar</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default UsuariosAdminAdmin;