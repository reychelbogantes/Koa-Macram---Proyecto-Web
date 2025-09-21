import React, { useEffect, useState } from 'react';
import { getContactos } from '../../Services/Servicios';
import MenuIzquierdo from '../MenuIzquierdo/MenuIzquierdo';

function ContactosAdmin() {
  const [contactos, setContactos] = useState([]);

  useEffect(() => {
    getContactos().then(setContactos).catch(console.error);
  }, []);

  return (
    <div>
      <MenuIzquierdo/>
      <div style={{ marginLeft: '240px', padding: '20px' }}>
        <h1>Mensajes de Contacto</h1>
        <table>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Mensaje</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {contactos.map(c => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
                <td>{c.mensaje}</td>
                <td>{new Date(c.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ContactosAdmin;
