import React, { useEffect, useState } from "react";
import "./FacturasAdmin.css";
import { getFacturas } from "../../Services/Servicios"; 
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";

function FacturasAdmin() {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // ✅ Estados para filtros
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const data = await getFacturas();
        setFacturas(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };
    cargarFacturas();
  }, []);

  if (cargando) return <p>Cargando facturas...</p>;
  if (error) return <p>Error: {error}</p>;

  // ✅ Filtrado combinado
  const facturasFiltradas = facturas.filter((f) => {
    const texto = busqueda.toLowerCase();
    const fechaFactura = new Date(f.fecha);
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    if (hasta) hasta.setHours(23,59,59,999); // incluye todo el día final

    const coincideTexto =
      f.id.toString().toLowerCase().includes(texto) ||
      f.usuario.nombre.toLowerCase().includes(texto) ||
      f.usuario.email.toLowerCase().includes(texto);

    const coincideFecha =
      (!desde || fechaFactura >= desde) &&
      (!hasta || fechaFactura <= hasta);

    return coincideTexto && coincideFecha;
  });

  return (
    <div>
      <div className="facturas-admin">
        <h1>Listado de Facturas</h1>

        {/* 🔎 Barra de búsqueda y filtro por fecha */}
        <div className="filtros-superiores">
          <input
            type="text"
            placeholder="Buscar por ID, nombre o email..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />

          <label>
            Desde:
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
            />
          </label>
          <label>
            Hasta:
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
            />
          </label>
        </div>

        {facturasFiltradas.length === 0 ? (
          <p>No hay facturas que coincidan con los filtros.</p>
        ) : (
          <table className="tabla-facturas">
            <thead>
              <tr>
                <th>ID</th>
                <th>Fecha</th>
                <th>Usuario</th>
                <th>Email</th>
                <th>Tipo Envío</th>
                <th>Subtotal</th>
                <th>Costo Envío</th>
                <th>Total</th>
                <th>ID Transacción</th>
                <th>Productos</th>
              </tr>
            </thead>
            <tbody>
  {facturasFiltradas.map((f) => (
    <tr key={f.id}>
      <td data-label="ID">{f.id}</td>
      <td data-label="Fecha">{new Date(f.fecha).toLocaleString()}</td>
      <td data-label="Usuario">{f.usuario.nombre}</td>
      <td data-label="Email">{f.usuario.email}</td>
      <td data-label="Tipo Envío">{f.tipoEnvio}</td>
      <td data-label="Subtotal">${f.subtotal.toLocaleString()}</td>
      <td data-label="Costo Envío">${f.costoEnvio.toLocaleString()}</td>
      <td data-label="Total"><strong>${f.total.toLocaleString()}</strong></td>
      <td data-label="Transacción">{f.idTransaccion}</td>
      <td data-label="Productos">
        <details>
          <summary>Ver productos</summary>
          <ul>
            {f.productos.map((p) => (
              <li key={p.id}>
                {p.nombre} – Cant: {p.cantidad} – Precio: ${p.precio}
              </li>
            ))}
          </ul>
        </details>
      </td>
    </tr>
  ))}
</tbody>

          </table>
        )}
      </div>
    </div>
  );
}

export default FacturasAdmin;
