import React, { useState } from "react";


function FormularioEnvio({ onSubmit, datosIniciales}) {
  const [formData, setFormData] = useState({
    nombre: datosIniciales?.nombre || "",
    direccion: datosIniciales?.direccion || "",
    telefono: datosIniciales?.telefono || "",
    metodoEnvio: datosIniciales?.metodoEnvio || "Correo de Costa Rica",
    observaciones: datosIniciales?.observaciones || ""
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.direccion || !formData.telefono) {
      setError("Por favor completa los campos obligatorios.");
      return;
    }
    setError("");
    // ✅ Aquí se puede enviar la información al backend o JSON-Server
    if(onSubmit) onSubmit(formData);
    alert("¡Datos de envío guardados correctamente!");
  };

  return (
    <form className="form-envio" onSubmit={handleSubmit}>
      <h2>Formulario de Envío</h2>

      {error && <p className="error">{error}</p>}

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

      <label>Método de envío</label>
      <select
        name="metodoEnvio"
        value={formData.metodoEnvio}
        onChange={handleChange}
      >
        <option value="Correo de Costa Rica">Envío por Correo de CR ($7)</option>
        <option value="retiro">Retiro en tienda (Gratis)</option>
      </select>

      <label>Observaciones</label>
      <textarea
        name="observaciones"
        value={formData.observaciones}
        onChange={handleChange}
        placeholder="Notas adicionales para el repartidor"
      />

      <button type="submit" className="btn-enviar">Confirmar Envío</button>
    </form>
  );
}

export default FormularioEnvio;
