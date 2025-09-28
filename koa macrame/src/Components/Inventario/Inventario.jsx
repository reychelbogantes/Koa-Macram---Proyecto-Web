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

  // ✅ estados de filtro
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('todos'); // todos | activos | desactivados | destacados

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

  // ✅ filtrado en tiempo real: texto + estado
  const productosFiltrados = productos.filter(p => {
    const coincideTexto =
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    let coincideEstado = true;
    if (filtroEstado === 'activos') coincideEstado = p.activo === true;
    if (filtroEstado === 'desactivados') coincideEstado = p.activo === false;
    if (filtroEstado === 'destacados') coincideEstado = p.destacado === true;

    return coincideTexto && coincideEstado;
  });

  return (
    <div>
      <h1 className='Titulo'>Inventario</h1>

      {/* ✅ Barra de búsqueda + filtro de estado */}
      <div className="filtros-superiores">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select
          value={filtroEstado}
          onChange={(e) => setFiltroEstado(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="activos">Activos</option>
          <option value="desactivados">Desactivados</option>
          <option value="destacados">Destacados</option>
        </select>
      </div>

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
          {productosFiltrados.map(p => (
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
                  `$${p.precio}`
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
                <button onClick={() => remove(p.id)}>🗑️ Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventario;
