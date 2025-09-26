import React, { useEffect, useState } from "react";
import { getContactos } from "../../Services/Servicios";
import "./BuzonContactos.css";



function BuzonContactos() {
  const [contactos, setContactos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroFecha, setFiltroFecha] = useState("");

  useEffect(() => {
    async function cargarContactos() {
      try {
        const data = await getContactos();
        // Ordena por fecha descendente
        const ordenados = data.sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
        setContactos(ordenados);
      } catch (err) {
        console.error("Error al cargar los contactos:", err);
      }
    }
    cargarContactos();
  }, []);

  // ✅ Filtrado dinámico
  const contactosFiltrados = contactos.filter(c => {
    const coincideNombre = c.nombre.toLowerCase().includes(filtroNombre.toLowerCase());
    const coincideFecha = filtroFecha
      ? new Date(c.fecha).toISOString().slice(0,10) === filtroFecha
      : true;
    return coincideNombre && coincideFecha;
  });

  return (
    <div className="buzon-contactos">
      <h2>📬 Buzón de Contacto</h2>

      {/* 🔎 Filtros */}
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />
        <input
          type="date"
          value={filtroFecha}
          onChange={(e) => setFiltroFecha(e.target.value)}
        />
        {(filtroNombre || filtroFecha) && (
          <button onClick={() => {setFiltroNombre(""); setFiltroFecha("");}}>
            Limpiar filtros
          </button>
        )}
      </div>

      {contactosFiltrados.length === 0 ? (
        <p>No hay mensajes que coincidan con el filtro.</p>
      ) : (
        <table className="tabla-contactos">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Mensaje</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {contactosFiltrados.map(c => (
              <tr key={c.id}>
                <td>{c.nombre}</td>
                <td>{c.email}</td>
                <td>{c.mensaje}</td>
                <td>{new Date(c.fecha).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default BuzonContactos;