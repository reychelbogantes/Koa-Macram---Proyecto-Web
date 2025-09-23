import React, { useEffect, useState } from "react";
import { FaMapMarkerAlt, FaTrash, FaEdit, FaCheckCircle, FaTimes } from "react-icons/fa";
import {
  obtenerDireccionesUsuario,
  actualizarDireccionesUsuario,
  generarIdDireccion
} from "../../Services/Servicios";
import FormularioEnvio from "../ComponentsCarrito/FormularioEnvio";

function UbicacionesUsuario({onSeleccion}) {
  const [direcciones, setDirecciones] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [editando, setEditando] = useState(null);
  const [seleccionada, setSeleccionada] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("usuarioLogueado");
    if (userData) {
      const user = JSON.parse(userData);
      setUsuario(user);
      refrescarDirecciones(user.id);
    }
  }, []);

  const refrescarDirecciones = async (idUsuario) => {
    const dirs = await obtenerDireccionesUsuario(idUsuario);
    setDirecciones(dirs);
    const principal = dirs.find(d => d.seleccionada);
    setSeleccionada(principal ? principal.id : null);

     // ✅ Notificamos al padre apenas tenemos la dirección principal
    if (principal && onSeleccion) onSeleccion(principal);
  };

  const guardarDireccion = async (datos) => {
  let nuevas = [...direcciones];

  if (editando) {
    // Si estamos editando, no tocamos el estado de seleccionada
    nuevas = nuevas.map(d =>
      d.id === editando
        ? { ...datos, id: editando, seleccionada: d.seleccionada }
        : d
    );
  } else {
    //  Si NO hay direcciones todavía, esta será la primera: la marcamos seleccionada
    const esPrimera = nuevas.length === 0;
    nuevas.push({
      ...datos,
      id: generarIdDireccion(),
      seleccionada: esPrimera
    });
  }

  await actualizarDireccionesUsuario(usuario.id, nuevas);
  setFormVisible(false);
  setEditando(null);
  refrescarDirecciones(usuario.id);
};

  const eliminarDireccion = async (id) => {
    const nuevas = direcciones.filter(d => d.id !== id);
    await actualizarDireccionesUsuario(usuario.id, nuevas);
    refrescarDirecciones(usuario.id);
  };

  const seleccionarDireccion = async (id) => {
    const nuevas = direcciones.map(d => ({ ...d, seleccionada: d.id === id }));
    await actualizarDireccionesUsuario(usuario.id, nuevas);
    setSeleccionada(id);
    refrescarDirecciones(usuario.id);

     // ✅ Notificamos al padre cuál es la dirección seleccionada
    const nuevaSeleccion = nuevas.find(d => d.id === id);
    if (onSeleccion) onSeleccion(nuevaSeleccion);
    setModalAbierto(false);


  };

  if (!usuario) return <p>Debes iniciar sesión para administrar tus direcciones.</p>;

  const direccionActual = direcciones.find(d => d.id === seleccionada);

  return (
    <div className="ubicaciones-container">
      <h2><FaMapMarkerAlt className="icono-ubicacion" /> Dirección de entrega</h2>

      {/* Tarjeta de la dirección seleccionada */}
      {direccionActual && (
        <div
          className="tarjeta-direccion seleccionada"
          onClick={() => setModalAbierto(true)}
        >
          <strong>{direccionActual.nombre} {direccionActual.telefono}</strong>
          <p>{direccionActual.direccion}</p>
          <p>{direccionActual.metodoEnvio}</p>
          {direccionActual.observaciones && <p>Nota: {direccionActual.observaciones}</p>}
          <small className="click-hint">(Toca para ver más ubicaciones)</small>
        </div>
      )}

      {!direccionActual && !formVisible && (
        <button className="btn-agregar" onClick={() => { setFormVisible(true); setEditando(null); }}>
          ➕ Agregar ubicación
        </button>
      )}

      {formVisible && (
        <FormularioEnvio
          onSubmit={guardarDireccion}
          datosIniciales={editando ? direcciones.find(d => d.id === editando) : null}
        />
      )}

      {/* Modal con todas las direcciones */}
      {modalAbierto && (
        <div className="modal-overlay-1" onClick={() => setModalAbierto(false)}>
          <div className="modal-content-1" onClick={e => e.stopPropagation()}>
            <button className="modal-close-1" onClick={() => setModalAbierto(false)}>
              <FaTimes />
            </button>
            <h3>Todas las ubicaciones</h3>

            {direcciones.map((d) => (
              <div
                key={d.id}
                className={`tarjeta-direccion ${d.id === seleccionada ? "seleccionada" : ""}`}
              >
                <strong>{d.nombre} {d.telefono}</strong>
                <p>{d.direccion}</p>
                <p>{d.metodoEnvio}</p>
                {d.observaciones && <p>Nota: {d.observaciones}</p>}

                <div className="acciones-1">
                  <button onClick={() => { setFormVisible(true); setEditando(d.id); setModalAbierto(false); }}>
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => eliminarDireccion(d.id)}>
                    <FaTrash /> Eliminar
                  </button>
                  <button
                    className={`btn-seleccionar ${d.id === seleccionada ? "activo" : ""}`}
                    onClick={() => seleccionarDireccion(d.id)}
                  >
                    {d.id === seleccionada ? "Seleccionada" : "Usar esta dirección"}
                  </button>
                </div>
              </div>
            ))}

            {!formVisible && (
              <button
                className="btn-agregar"
                onClick={() => { setFormVisible(true); setEditando(null); setModalAbierto(false); }}
              >
                ➕ Agregar ubicación
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default UbicacionesUsuario;
