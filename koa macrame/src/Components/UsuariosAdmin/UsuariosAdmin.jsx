import React, { useEffect, useState } from 'react';
import { GetUsers, updateUser } from '../../Services/Servicios'; // ✅ asegúrate de tener updateUser en tu servicio
import './UsuariosAdmin.css';

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  // 🔎 estado para la búsqueda
  const [busqueda, setBusqueda] = useState("");

  // ✏️ estados para edición
  const [editando, setEditando] = useState(null); // id del usuario que se edita
  const [editData, setEditData] = useState({ name: "", email: "" });

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
    try {
      await updateUser(id, editData);   // ✅ tu servicio debe aceptar (id, { name, email })
      // actualizamos la lista local para no recargar
      setUsuarios(prev =>
        prev.map(u => u.id === id ? { ...u, ...editData } : u)
      );
      setEditando(null);
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
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
                <td>
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
                <td>
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
                <td className='Acciones-btn'>
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
    </div>
  );
}

export default UsuariosAdmin;
