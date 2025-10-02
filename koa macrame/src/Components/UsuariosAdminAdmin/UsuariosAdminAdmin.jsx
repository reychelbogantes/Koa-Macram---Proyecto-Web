import React, { useEffect, useState } from "react";
import { getAdmins, createAdmin, updateAdmin } from "../../Services/Servicios";
import ModalAlert from "../../Components/ModalAlert/ModalAlert"; 
import './UsuariosAdminAdmin.css';

function UsuariosAdminAdmin() {
  const [usuariosAdmin, setUsuariosAdmin] = useState([]);
  const [nuevoAdmin, setNuevoAdmin] = useState({ name: "", email: "", password: "" });
  const [editando, setEditando] = useState(null);
  const [formEdit, setFormEdit] = useState({ name: "", email: "" });

  // 📌 Estado para manejar alertas
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => { cargarAdmins(); }, []);

  async function cargarAdmins() {
    const data = await getAdmins();
    setUsuariosAdmin(data);
  }

  // 👉 Crear nuevo admin con validación y modal
  async function crearAdmin(e) {
    e.preventDefault();

    const nombreValido = nuevoAdmin.name.trim() !== "";
    const emailValido = nuevoAdmin.email.trim() !== "";
    const passwordValido = nuevoAdmin.password.trim() !== "";

    if (!nombreValido || !emailValido || !passwordValido) {
      setAlertConfig({
        isOpen: true,
        title: "Error de Validación",
        message: "⚠️ Ningún campo puede estar vacío o contener solo espacios."
      });
      return;
    }

    await createAdmin(nuevoAdmin);
    setNuevoAdmin({ name: "", email: "", password: "" });
    cargarAdmins();

    setAlertConfig({
      isOpen: true,
      title: "Éxito",
      message: "✅ Administrador creado correctamente."
    });
  }

  function empezarEdicion(u) {
    setEditando(u.id);
    setFormEdit({ name: u.name, email: u.email });
  }

  // 👉 Guardar edición con validación y modal
  async function guardarEdicion(id) {
    const nombreValido = formEdit.name.trim() !== "";
    const emailValido = formEdit.email.trim() !== "";

    if (!nombreValido || !emailValido) {
      setAlertConfig({
        isOpen: true,
        title: "Error de Validación",
        message: "⚠️ El nombre y correo no pueden estar vacíos o solo con espacios."
      });
      return;
    }

    await updateAdmin(id, { name: formEdit.name, email: formEdit.email });
    setEditando(null);
    cargarAdmins();

    setAlertConfig({
      isOpen: true,
      title: "Éxito",
      message: "✅ Administrador actualizado correctamente."
    });
  }

  return (
    <div className="usuarios-admin-container" style={{ padding: "2rem" }}>
      <h2>👥 Administrar Usuarios Administrativos</h2>

      {/* Crear nuevo admin */}
      <form className="form-crear-admin" onSubmit={crearAdmin} style={{
        marginBottom: "2rem", background: "#f4f4f8",
        padding: "1rem", borderRadius: "8px"
      }}>
        <h3>Crear nuevo administrador</h3>
        <input type="text" placeholder="Nombre" value={nuevoAdmin.name}
          onChange={e => setNuevoAdmin({ ...nuevoAdmin, name: e.target.value })} />
        <input type="email" placeholder="Correo" value={nuevoAdmin.email}
          onChange={e => setNuevoAdmin({ ...nuevoAdmin, email: e.target.value })} />
        <input type="password" placeholder="Contraseña" value={nuevoAdmin.password}
          onChange={e => setNuevoAdmin({ ...nuevoAdmin, password: e.target.value })} />
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
            <tr key={u.id}>
              <td data-label="Nombre">
                {editando === u.id ? (
                  <input value={formEdit.name}
                    onChange={e => setFormEdit({ ...formEdit, name: e.target.value })} />
                ) : u.name}
              </td>
              <td data-label="Correo">
                {editando === u.id ? (
                  <input value={formEdit.email}
                    onChange={e => setFormEdit({ ...formEdit, email: e.target.value })} />
                ) : u.email}
              </td>
              <td data-label="Fecha Registro">
                {new Date(u.fechaRegistro).toLocaleDateString()}
              </td>
              <td data-label="Acciones">
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

      {/* Modal de alerta */}
      <ModalAlert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </div>
  );
}
export default UsuariosAdminAdmin;
