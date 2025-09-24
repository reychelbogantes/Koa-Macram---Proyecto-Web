import React, { useEffect, useState } from "react";
import "./FacturasAdmin.css";
import { getFacturas } from "../../Services/Servicios"; 
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";

function FacturasAdmin() {
  const [facturas, setFacturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const cargarFacturas = async () => {
      try {
        const data = await getFacturas(); // ✅ ahora usamos el servicio
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

  return (

    <div>
    
    <div className="facturas-admin">
      <h1>Listado de Facturas</h1>
      {facturas.length === 0 ? (
        <p>No hay facturas registradas.</p>
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
            {facturas.map((f) => (
              <tr key={f.id}>
                <td>{f.id}</td>
                <td>{new Date(f.fecha).toLocaleString()}</td>
                <td>{f.usuario.nombre}</td>
                <td>{f.usuario.email}</td>
                <td>{f.tipoEnvio}</td>
                <td>${f.subtotal.toLocaleString()}</td>
                <td>${f.costoEnvio.toLocaleString()}</td>
                <td><strong>${f.total.toLocaleString()}</strong></td>
                <td>{f.idTransaccion}</td>
                <td>
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
