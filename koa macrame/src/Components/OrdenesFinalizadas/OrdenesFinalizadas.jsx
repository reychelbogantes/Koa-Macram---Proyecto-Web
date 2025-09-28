import React, { useEffect, useState } from "react";
import { getOrdenes } from "../../Services/Servicios";
import "./OrdenesFinalizadas.css";
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";

function OrdenesFinalizadas() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ estados para los filtros
  const [busqueda, setBusqueda] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getOrdenes();
        // ✅ Solo mostrar las que estén en estado "enviado" (finalizadas)
        setOrdenes(data.filter((o) => o.estado === "enviado"));
      } catch (err) {
        console.error("Error al cargar órdenes finalizadas:", err);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  if (cargando) return <p>Cargando pedidos finalizados...</p>;

  // ✅ Filtrado combinado: texto + rango de fechas
  const ordenesFiltradas = ordenes.filter((o) => {
    const texto = busqueda.toLowerCase();
    const fechaOrden = new Date(o.fecha); // asegúrate de que cada orden tenga campo fecha
    const desde = fechaInicio ? new Date(fechaInicio) : null;
    const hasta = fechaFin ? new Date(fechaFin) : null;

    if (hasta) hasta.setHours(23, 59, 59, 999);

    const coincideTexto =
      o.id.toString().toLowerCase().includes(texto) ||
      o.usuario.nombre.toLowerCase().includes(texto) ||
      o.usuario.email.toLowerCase().includes(texto);

    const coincideFecha =
      (!desde || fechaOrden >= desde) &&
      (!hasta || fechaOrden <= hasta);

    return coincideTexto && coincideFecha;
  });

  return (
    <div>
      <div className="ordenes-finalizadas">
        <h1>Pedidos Finalizados</h1>

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

        {ordenesFiltradas.length === 0 ? (
          <p>No hay pedidos que coincidan con los filtros.</p>
        ) : (
          <div className="lista-ordenes">
            {ordenesFiltradas.map((o) => (
              <div key={o.id} className="orden-card">
                <h3>Pedido #{o.id}</h3>
                <p><strong>Cliente:</strong> {o.usuario.nombre}</p>
                <p><strong>Email:</strong> {o.usuario.email}</p>
                <p><strong>Teléfono:</strong> {o.usuario.telefono}</p>
                <p><strong>Dirección:</strong> {o.usuario.direccion}</p>
                {o.usuario.observaciones && (
                  <p><strong>Observaciones:</strong> {o.usuario.observaciones}</p>
                )}
                <p><strong>Tipo de Envío:</strong> {o.tipoEnvio}</p>
                <p><strong>Total:</strong> ${o.total.toLocaleString()}</p>

                <h4>Productos:</h4>
                <ul>
                  {o.productos.map((p) => (
                    <li key={p.id}>
                      {p.nombre} – Cant: {p.cantidad} – Precio: ${p.precio}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdenesFinalizadas;
