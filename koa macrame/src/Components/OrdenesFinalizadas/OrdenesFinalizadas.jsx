import React, { useEffect, useState } from "react";
import { getOrdenes } from "../../Services/Servicios";
import "./OrdenesFinalizadas.css";
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";

function OrdenesFinalizadas() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

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

  return (
    <div>
    

      <div className="ordenes-finalizadas">
        <h1>Pedidos Finalizados</h1>

        {ordenes.length === 0 ? (
          <p>No hay pedidos finalizados.</p>
        ) : (
          <div className="lista-ordenes">
            {ordenes.map((o) => (
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
                <p><strong>Total:</strong> ₡{o.total.toLocaleString()}</p>

                <h4>Productos:</h4>
                <ul>
                  {o.productos.map((p) => (
                    <li key={p.id}>
                      {p.nombre} – Cant: {p.cantidad} – Precio: ₡{p.precio}
                    </li>
                  ))}
                </ul>

                {/* Aquí solo mostramos información. 
                    Si deseas opciones (por ejemplo volver a pendientes) 
                    podrías añadir un botón que use updateOrdenEstado */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OrdenesFinalizadas;
