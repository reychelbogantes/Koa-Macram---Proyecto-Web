import React, { useEffect, useState } from 'react';
import {
  getProductos,
  updateProducto,
  deleteProducto
} from '../../Services/Servicios';
import MenuIzquierdo from '../MenuIzquierdo/MenuIzquierdo';
import './Inventario.css';

function Inventario() {
  const [productos, setProductos] = useState([]);
  const [editando, setEditando] = useState(null);
  const [editData, setEditData] = useState({ nombre:'', descripcion:'', precio:'' });

  const fetchData = () => {
    getProductos().then(setProductos).catch(console.error);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---- Editar
  const startEdit = (p) => {
    setEditando(p.id);
    setEditData({ nombre:p.nombre, descripcion:p.descripcion, precio:p.precio });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData({ ...editData, [name]: value });
  };

  const saveEdit = async (id) => {
    await updateProducto(id, editData);
    setEditando(null);
    fetchData();
  };

  // ---- Desactivar/Activar
  const toggleActivo = async (p) => {
    await updateProducto(p.id, { activo: !p.activo });
    fetchData();
  };

  // ---- Destacar
  const toggleDestacado = async (p) => {
    await updateProducto(p.id, { destacado: !p.destacado });
    fetchData();
  };

  // ---- Eliminar
  const remove = async (id) => {
    if (window.confirm("¿Eliminar este producto?")) {
      await deleteProducto(id);
      fetchData();
    }
  };

  return (
    <div>
      
      <div >
        <h1 className='Titulo'>Inventario</h1>
        <table className="tabla-inventario">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th>Estado</th>
              <th>Destacado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map(p => (
              <tr key={p.id} className={!p.activo ? 'desactivado' : ''}>
                <td>
                  {p.foto && <img src={p.foto} alt={p.nombre} className="thumb"/>}
                </td>

                <td>
                  {editando === p.id ?
                    <input name="nombre" value={editData.nombre} onChange={handleEditChange}/> :
                    <strong>{p.nombre}</strong>
                  }
                </td>

                <td>
                  {editando === p.id ?
                    <textarea name="descripcion" value={editData.descripcion} onChange={handleEditChange}/> :
                    p.descripcion
                  }
                </td>

                <td>
                  {editando === p.id ?
                    <input name="precio" type="number" value={editData.precio} onChange={handleEditChange}/> :
                    `₡${p.precio}`
                  }
                </td>

                <td>{p.activo ? 'Activo' : 'Inactivo'}</td>

                <td>{p.destacado ? '⭐' : ''}</td>

                <td className="acciones">
                  {editando === p.id ? (
                    <button onClick={() => saveEdit(p.id)}>💾 Guardar</button>
                  ) : (
                    <button onClick={() => startEdit(p)}>✏️ Editar</button>
                  )}
                  <button onClick={() => toggleActivo(p)}>
                    {p.activo ? '🚫 Desactivar' : '✅ Activar'}
                  </button>
                  <button className='desactivar' onClick={() => toggleDestacado(p)}>
                    {p.destacado ? 'Quitar destacado' : '⭐ Destacar'}
                  </button>
                  <button onClick={() => remove(p.id)}>🗑 Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inventario;

