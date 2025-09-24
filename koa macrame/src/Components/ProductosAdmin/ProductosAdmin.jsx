import React, { useState } from 'react';
import './ProductosAdmin.css';
import { postProducto, } from '../../Services/Servicios';
import MenuIzquierdo from '../MenuIzquierdo/MenuIzquierdo';

function ProductosAdmin() {
  const [producto, setProducto] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    foto: ''
  });
  const [preview, setPreview] = useState(null);

  // Actualiza texto y precio
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProducto({ ...producto, [name]: value });
  };

  // Convierte la imagen a Base64 para guardar en db.json
  const handleFoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProducto({ ...producto, foto: reader.result });
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await postProducto(producto);
      alert('✅ Producto guardado en db.json');
      // Limpia el formulario
      setProducto({ nombre: '', descripcion: '', precio: '', foto: '' });
      setPreview(null);
    } catch (error) {
      console.error(error);
      alert('❌ Error al guardar el producto');
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
          Precio (₡):
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
    </div>
 
  );
}

export default ProductosAdmin;
