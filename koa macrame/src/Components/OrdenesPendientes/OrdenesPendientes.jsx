import React, { useEffect, useState } from "react";
import { getOrdenes, updateOrdenEstado } from "../../Services/Servicios";
import "./OrdenesPendientes.css";
import MenuIzquierdo from "../MenuIzquierdo/MenuIzquierdo";
import ModalAlert from "../../Components/ModalAlert/ModalAlert"; // ⚠️ Ajusta la ruta

function OrdenesPendientes() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  // ✅ Estados para modales
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);

  useEffect(() => {
    const cargar = async () => {
      try {
        const data = await getOrdenes();
        setOrdenes(data.filter((o) => o.estado === "pendiente"));
      } catch (err) {
        console.error("Error al cargar órdenes:", err);
        setModalMsg("Error al cargar pedidos pendientes ❌");
        setModalOpen(true);
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, []);

  const marcarEnviado = async (id) => {
    try {
      await updateOrdenEstado(id, "enviado");
      setOrdenes((prev) => prev.filter((o) => o.id !== id));
      setModalMsg("El pedido ha sido marcado como enviado ✅");
      setModalOpen(true);
    } catch (err) {
      console.error("Error al marcar como enviado:", err);
      setModalMsg("Hubo un problema al marcar como enviado ❌");
      setModalOpen(true);
    }
  };

  // ✅ Abre el modal de confirmación para cancelar
  const abrirConfirmacion = (id) => {
    setPedidoSeleccionado(id);
    setConfirmOpen(true);
  };

  const cancelarPedido = async () => {
    if (!pedidoSeleccionado) return;
    try {
      await updateOrdenEstado(pedidoSeleccionado, "cancelado");
      setOrdenes((prev) => prev.filter((o) => o.id !== pedidoSeleccionado));
      setModalMsg("El pedido ha sido cancelado y ahora aparece en 'cancelados' ✅");
      setModalOpen(true);
    } catch (err) {
      console.error("Error al cancelar pedido:", err);
      setModalMsg("Hubo un problema al cancelar el pedido ❌");
      setModalOpen(true);
    } finally {
      setConfirmOpen(false);
      setPedidoSeleccionado(null);
    }
  };

  if (cargando) return <p>Cargando pedidos...</p>;

  return (
    <div>
      <div className="ordenes-pendientes">
        <h1>Pedidos Pendientes</h1>

        {ordenes.length === 0 ? (
          <p>No hay pedidos pendientes.</p>
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
                    className="btn-M-enviar"
                    onClick={() => marcarEnviado(o.id)}
                  >
                    Marcar como Enviado
                  </button>
                  <button
                    className="btn-cancelar"
                    onClick={() => abrirConfirmacion(o.id)}
                  >
                    Cancelar pedido
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ✅ Modal de alerta de mensajes */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aviso"
        message={modalMsg}
      />

      {/* ✅ Modal de confirmación para cancelar pedido */}
      {confirmOpen && (
        <div className="modal-overlayC" onClick={() => setConfirmOpen(false)}>
          <div className="modal-alertC" onClick={(e) => e.stopPropagation()}>
            <h2>Confirmar cancelación</h2>
            <p>
              ¿Seguro que quieres cancelar este pedido? 
              Pasará a la sección de <strong>pedidos cancelados</strong>.
            </p>
            <button className="modal-buttonC" onClick={cancelarPedido}>
              Sí, cancelar
            </button>
            <button className="modal-buttonC" onClick={() => setConfirmOpen(false)}>
              No, volver
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdenesPendientes;

