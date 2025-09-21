import React, { useState } from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { postContacto } from '../../Services/Servicios';
import './Contactanos.css';

function Contactanos() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [estado, setEstado] = useState(null); // success | error

  const handleSubmit = async (e) => {
    e.preventDefault();
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
        <h2>Contáctanos</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nombre"
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <textarea
            placeholder="Escribe tu mensaje"
            value={mensaje}
            onChange={e => setMensaje(e.target.value)}
            required
          />
          <button type="submit">Enviar</button>
        </form>

        {estado === 'success' && <p className="exito">¡Gracias por tu mensaje! Nos pondremos en contacto pronto.</p>}
        {estado === 'error' && <p className="error">Ocurrió un error al enviar. Inténtalo de nuevo.</p>}
      </section>

      <section className="datos-contacto">
        <h2>Información de Contacto</h2>
        <p><strong>Dirección:</strong> San José, Costa Rica</p>
        <p><strong>Teléfono:</strong> +506 8791 3622</p>
        <p><strong>Email:</strong> contacto@koamacrame.cr</p>
        <p>
          Síguenos en redes:
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"> Facebook</a>,
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"> Instagram</a>
        </p>
      </section>

     
    </div>
    <Footer />
    </div>
  );
}

export default Contactanos;
