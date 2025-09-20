import React, { useEffect, useState } from 'react';
import { GetUsers } from '../../Services/Servicios';
import MenuIzquierdo from '../MenuIzquierdo/MenuIzquierdo';
import './UsuariosAdmin.css';

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    GetUsers()
      .then(setUsuarios)
      .catch(console.error);
  }, []);

  return (
    <div>
      <MenuIzquierdo />
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <h1 className='Titulo'>Usuarios registrados</h1>
        <table className="tabla-usuarios">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default UsuariosAdmin;
