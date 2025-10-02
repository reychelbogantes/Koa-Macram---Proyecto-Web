import React, { useState } from 'react';
import './ProductosAdmin.css';
import { postProducto } from '../../Services/Servicios';
import ModalAlert from '../../Components/ModalAlert/ModalAlert';
import { uploadToCloudinary } from '../CLOUD/SubirCloudinary'; // 👈 importamos tu función

function ProductosAdmin() {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    foto: ''
  });
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null); // archivo que subiremos a Cloudinary

  // ✅ Estados para el modal de alerta
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMsg, setModalMsg] = useState('');

  // Actualiza texto y precio
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  // Guardamos el archivo y mostramos preview
  const handleFoto = (e) => {
    const archivo = e.target.files[0];
    if (archivo) {
      setFile(archivo);
      setPreview(URL.createObjectURL(archivo)); // preview temporal
    }
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let imageUrl = '';

      // ✅ Subir la imagen a Cloudinary si hay archivo seleccionado
      if (file) {
        const res = await uploadToCloudinary(file);
        imageUrl = res.secure_url; // URL pública de Cloudinary
      }

      // Guardamos el producto con la URL en la DB
      await postProducto({
        ...producto,
        foto: imageUrl
      });

      setModalMsg('✅ Producto guardado correctamente');
      setModalOpen(true);

      // Limpia el formulario
      setProducto({ nombre: '', descripcion: '', precio: '', foto: '' });
      setPreview(null);
      setFile(null);
    } catch (error) {
      console.error(error);
      setModalMsg('❌ Error al guardar el producto');
      setModalOpen(true);
    }
  };

  return (
    <div>
      <div className="productos-admin">
        <h2>Ingresar nuevo producto</h2>

        <form className="form-producto" onSubmit={handleSubmit}>
          <label>
            Nombre del producto:
            <input
              type="text"
              name="nombre"
              value={producto.nombre}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Descripción:
            <textarea
              name="descripcion"
              value={producto.descripcion}
              onChange={handleChange}
              rows="4"
              required
            />
          </label>

          <label>
            Precio ($):
            <input
              type="number"
              name="precio"
              value={producto.precio}
              onChange={handleChange}
              step="0.01"
              required
            />
          </label>

          <label className="foto-label">
            Foto del producto:
            <input
              type="file"
              accept="image/*"
              onChange={handleFoto}
              required
            />
          </label>

          {preview && (
            <div className="preview-container">
              <img src={preview} alt="Vista previa del producto" />
            </div>
          )}

          <button type="submit" className="btn-guardar">
            Guardar producto
          </button>
        </form>
      </div>

      {/* ✅ Modal de alerta que reemplaza los alert() */}
      <ModalAlert
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Aviso"
        message={modalMsg}
      />
    </div>
  );
}

export default ProductosAdmin;
