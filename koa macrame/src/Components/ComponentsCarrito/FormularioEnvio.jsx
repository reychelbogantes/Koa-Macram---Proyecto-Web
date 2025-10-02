import React, { useState } from "react";
import ModalAlert from "../../Components/ModalAlert/ModalAlert"; 

function FormularioEnvio({ onSubmit, datosIniciales }) {
  const [formData, setFormData] = useState({
    nombre: datosIniciales?.nombre || "",
    direccion: datosIniciales?.direccion || "",
    telefono: datosIniciales?.telefono || "",
    metodoEnvio: datosIniciales?.metodoEnvio || "Correo de Costa Rica",
    observaciones: datosIniciales?.observaciones || ""
  });

  // ✅ Estados para el modal
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value })); // Actualiza el estado del formulario
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 🔎 Validar que ningún campo esté vacío o solo con espacios
    if (
      formData.nombre.trim() === "" ||// Aquí corregí un pequeño error tipográfico
      formData.direccion.trim() === "" ||// Aquí corregí un pequeño error tipográfico
      formData.telefono.trim() === "" ||// Aquí corregí un pequeño error tipográfico
      formData.observaciones.trim() === ""// No validamos métodoEnvio porque siempre tiene un valor por defecto
    ) {
      setModalTitle("Error de Validación");
      setModalMsg("⚠️ Todos los campos son obligatorios y no pueden estar vacíos.");
      setModalOpen(true);
      return;
    }

    // 🔎 Validación de teléfono básico
    const telRegex = /^[0-9]{4}-?[0-9]{4}$/; // Formato: 8888-8888 o 88888888
    if (!telRegex.test(formData.telefono.trim())) {
      setModalTitle("Teléfono inválido");
      setModalMsg("⚠️ El teléfono debe tener el formato 8888-8888 o 88888888.");
      setModalOpen(true);
      return;
    }

    // ✅ Enviar datos si todo es válido
    if (onSubmit) onSubmit(formData);

    setModalTitle("Éxito");
    setModalMsg("✅ Datos de envío guardados correctamente.");
    setModalOpen(true);
  };

  return (
    <>
      <form className="form-envio" onSubmit={handleSubmit}>
        <h2>Formulario de Envío</h2>

        <label>Nombre completo *</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          placeholder="Ej: Reychel Fallas"
          required
        />

        <label>Dirección de entrega *</label>
        <textarea
          name="direccion"
          value={formData.direccion}
          onChange={handleChange}
          placeholder="Provincia, cantón, distrito, señas exactas"
          required
        />

        <label>Teléfono de contacto *</label>
        <input
          type="tel"
          name="telefono"
          value={formData.telefono}
          onChange={handleChange}
          placeholder="Ej: 8888-8888"
          required
        />

        <label>Método de envío *</label>
        <select
          name="metodoEnvio"
          value={formData.metodoEnvio}
          onChange={handleChange}
          required
        >
          <option value="Correo de Costa Rica">Envío por Correo de CR ($7)</option>
          <option value="retiro">Retiro en tienda (Gratis)</option>
        </select>

        <label>Observaciones *</label>
        <textarea
          name="observaciones"
          value={formData.observaciones}
          onChange={handleChange}
          placeholder="Notas adicionales para el repartidor"
          required
        />

        <button type="submit" className="btn-enviar">Confirmar Envío</button>
      </form>

      {/* ✅ Modal de alerta */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={modalTitle}
        message={modalMsg}
      />
    </>
  );
}

export default FormularioEnvio;
