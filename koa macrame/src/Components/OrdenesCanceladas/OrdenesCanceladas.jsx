import React, { useEffect, useState } from "react";
import { getOrdenes, updateOrdenEstado } from "../../Services/Servicios";
import "./OrdenesCanceladas.css";
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";
import ModalAlert from "../../Components/ModalAlert/ModalAlert"; // ⚠️ Ajusta la ruta

function OrdenesCanceladas() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getOrdenes();
        setOrdenes(data.filter((o) => o.estado === "cancelado"));
      } catch (err) {
        console.error("Error al cargar órdenes canceladas:", err);
        setModalMsg("Error al cargar órdenes canceladas.");
        setModalOpen(true);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  // ✅ Abre modal de confirmación
  const abrirConfirmacion = (id) => {
    setPedidoSeleccionado(id);
    setConfirmOpen(true);
  };

  // ✅ Reactivar pedido
  const reactivarPedido = async () => {
    if (!pedidoSeleccionado) return;

    try {
      await updateOrdenEstado(pedidoSeleccionado, "pendiente");
      setOrdenes((prev) => prev.filter((o) => o.id !== pedidoSeleccionado));
      setModalMsg("El pedido ha sido reactivado y pasa a estado 'pendiente' ✅");
      setModalOpen(true);
    } catch (err) {
      console.error("Error al reactivar pedido:", err);
      setModalMsg("Hubo un problema al reactivar el pedido ❌");
      setModalOpen(true);
    } finally {
      setConfirmOpen(false);
      setPedidoSeleccionado(null);
    }
  };

  if (cargando) return <p>Cargando pedidos cancelados...</p>;

  return (
    <div>
      <div className="ordenes-canceladas">
        <h1>Pedidos Cancelados</h1>

        {ordenes.length === 0 ? (
          <p>No hay pedidos cancelados.</p>
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
                <p><strong>Total:</strong> ${o.total.toLocaleString()}</p>

                <h4>Productos:</h4>
                <ul>
                  {o.productos.map((p) => (
                    <li key={p.id}>
                      {p.nombre} – Cant: {p.cantidad} – Precio: ${p.precio}
                    </li>
                  ))}
                </ul>

                <div className="acciones-pedido">
                  <button
                    className="btn-reactivar"
                    onClick={() => abrirConfirmacion(o.id)}
                  >
                    Activar nuevamente
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Modal de alerta para mostrar mensajes finales */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aviso"
        message={modalMsg}
      />

      {/* ✅ Modal de confirmación (puedes personalizar estilos en CSS) */}
      {confirmOpen && (
        <div className="modal-overlayC" onClick={() => setConfirmOpen(false)}>
          <div className="modal-alertC" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar</h2>
            <p>¿Seguro que quieres reactivar este pedido? Pasará nuevamente a <strong>pendiente</strong>.</p>
            <button className="modal-buttonC" onClick={reactivarPedido}>Sí, reactivar</button>
            <button className="modal-buttonC" onClick={() => setConfirmOpen(false)}>Cancelar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdenesCanceladas;
