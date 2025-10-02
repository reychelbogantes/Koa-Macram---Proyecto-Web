import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { postContacto } from '../../Services/Servicios';
import './Contactanos.css';

function Contactanos() {
  // Favicon y título dinámicos
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = "/logo.png";
    document.title = "Contactnos | Koa Macramé";
  }, []);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState(null); // success | error | invalid

  const validarEmail = (correo) => {
    // Expresión regular simple: debe tener algo@algo
    return /\S+@\S+\.\S+/.test(correo);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validación manual del correo
    if (!validarEmail(email)) {
      setEstado('invalid');
      return;
    }

    try {
      await postContacto({ nombre, email, mensaje });
      setEstado('success');
      setNombre('');
      setEmail('');
      setMensaje('');
    } catch (error) {
      console.error(error);
      setEstado('error');
    }
  };

  // 🕒 Quitar mensaje automáticamente después de 2s
  useEffect(() => {
    if (estado) {
      const timer = setTimeout(() => {
        setEstado(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [estado]);

  return (
    <div>
      <div className="contacto-page">
        <Navbar />
        <br />
        <br />
        <br />
        <section className="info-negocio">
          <h1>Acerca de Nosotros</h1>
          <p>
            En Koa Macramé, nuestra pasión es crear piezas artesanales únicas que transmitan
            la esencia de la naturaleza y la valentía. 
          </p>
          <h2>Misión</h2>
          <p>
            Ofrecer productos de macramé de alta calidad, elaborados de manera sostenible,
            que embellezcan los espacios de nuestros clientes.
          </p>
          <h2>Visión</h2>
          <p>
            Ser un referente en diseño artesanal, fomentando el respeto y la conexión con la naturaleza.
          </p>
          <h2>Valores</h2>
          <ul>
            <li>Respeto por el medio ambiente</li>
            <li>Creatividad y autenticidad</li>
            <li>Compromiso con la calidad</li>
          </ul>
        </section>

        <section className="formulario-contacto">
          <h1>Contáctanos</h1>
          <div onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Nombre"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              required
            /> <br /><br />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            /> <br /><br />
            <textarea
              placeholder="Escribe tu mensaje"
              value={mensaje}
              onChange={e => setMensaje(e.target.value)}
              required
            /> <br />
            <button type="submit" onClick={handleSubmit}>Enviar</button>
          </div>

          {estado === 'success' && (
            <p className="exito1">¡Gracias por tu mensaje! Nos pondremos en contacto pronto.</p>
          )}
          {estado === 'error' && (
            <p className="error1">Ocurrió un error al enviar. Inténtalo de nuevo.</p>
          )}
          {estado === 'invalid' && (
            <p className="error1">Por favor ingresa un correo</p>
          )}
        </section>

        <section className="datos-contacto">
          <h1>Información de Contacto</h1>
          <p><strong>Dirección:</strong> San José, Costa Rica</p>
          <p><strong>Teléfono:</strong> +506 8791 3622</p>
          <p><strong>Email:</strong> contacto@koamacrame.cr</p>
          <p>
            Síguenos en redes:
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>,
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>
          </p>
        </section>

        <section className="datos-contacto">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7860.233550428351!2d-84.1250248106968!3d9.924231667830284!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0fdbc8749ad2f%3A0x96e351d4901c08d!2sCondominio%20Venehorizonte!5e0!3m2!1ses-419!2scr!4v1759122812992!5m2!1ses-419!2scr"
            width="350"
            height="200"
            style={{ borderRadius: 7 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default Contactanos;
