import React, { useEffect, useState } from 'react';
import { GetUsers, updateUser } from '../../Services/Servicios';
import ModalAlert from "../../Components/ModalAlert/ModalAlert"; 
import './UsuariosAdmin.css';

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  // 🔎 estado para la búsqueda
  const [busqueda, setBusqueda] = useState("");

  // ✏️ estados para edición
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ name: "", email: "" });

  // 📌 Estado para manejar el modal de alertas
  const [alertConfig, setAlertConfig] = useState({ isOpen: false, title: "", message: "" });

  useEffect(() => {
    GetUsers()
      .then(data => {
        const usuariosFiltrados = data.filter(u => u.rol === "user");
        setUsuarios(usuariosFiltrados);
      })
      .catch(console.error);
  }, []);

  // 👉 iniciar edición
  const startEdit = (u) => {
    setEditando(u.id);
    setEditData({ name: u.name, email: u.email });
  };

  // 👉 manejar cambios en inputs
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  // 👉 guardar cambios en servidor y refrescar
  const saveEdit = async (id) => {
    const nombreValido = editData.name.trim() !== "";
    const emailValido = editData.email.trim() !== "";

    if (!nombreValido || !emailValido) {
      setAlertConfig({
        isOpen: true,
        title: "Error de Validación",
        message: "⚠️ Los campos no pueden estar vacíos o solo con espacios."
      });
      return;
    }

    try {
      await updateUser(id, editData);
      setUsuarios(prev =>
        prev.map(u => u.id === id ? { ...u, ...editData } : u)
      );
      setEditando(null);

      setAlertConfig({
        isOpen: true,
        title: "Éxito",
        message: "✅ Usuario actualizado correctamente."
      });
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      setAlertConfig({
        isOpen: true,
        title: "Error",
        message: "❌ Hubo un problema al actualizar el usuario."
      });
    }
  };

  // 🔎 filtrado en tiempo real
  const usuariosFiltrados = usuarios.filter(u =>
    u.name.toLowerCase().includes(busqueda.toLowerCase()) ||
    u.email.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <div className='Usuarios-A'>
        <h1 className='Titulo'>Usuarios registrados</h1>

        {/* ✅ Barra de búsqueda */}
        <div className="barra-busqueda">
          <input
            type="text"
            placeholder="Buscar por nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <h3 className="Titulo1">
            <span className="contador-badge">{usuarios.length}</span>
          </h3>
        </div>

        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th className='Acciones-btn'>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((u) => (
              <tr key={u.id}>
                <td data-label="Nombre">
                  {editando === u.id ? (
                    <input
                      name="name"
                      value={editData.name}
                      onChange={handleEditChange}
                    />
                  ) : (
                    u.name
                  )}
                </td>
                <td data-label="Email">
                  {editando === u.id ? (
                    <input
                      name="email"
                      value={editData.email}
                      onChange={handleEditChange}
                    />
                  ) : (
                    u.email
                  )}
                </td>
                <td data-label="Acciones" className='Acciones-btn'>
                  {editando === u.id ? (
                    <button className='btn-editar-user' onClick={() => saveEdit(u.id)}>💾 Guardar</button>
                  ) : (
                    <button className='btn-editar-user' onClick={() => startEdit(u)}>✏️ Editar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Modal de alertas */}
      <ModalAlert
        isOpen={alertConfig.isOpen}
        onClose={() => setAlertConfig({ ...alertConfig, isOpen: false })}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </div>
  );
}

export default UsuariosAdmin;
