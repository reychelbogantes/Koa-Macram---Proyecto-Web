import React from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './LegalPages.css';

function TerminosCondiciones() {
  return (
    <div className="legal-page">
      <Navbar/>
      <br />
      <br />
      <div className="legal-container">
        <h1>Términos y Condiciones</h1>
        <p>Bienvenido/a a Koa Macramé. Al acceder y utilizar nuestro sitio web aceptas los siguientes términos y condiciones:</p>

        <h2>Uso del sitio</h2>
        <p>
          El contenido de este sitio es exclusivamente para fines informativos y para la compra de nuestros productos.
          No está permitido el uso indebido, la copia no autorizada ni la distribución de la información sin nuestro consentimiento.
        </p>

        <h2>Pedidos y pagos</h2>
        <p>
          Todos los pedidos están sujetos a disponibilidad. Los precios pueden cambiar sin previo aviso.
          Los pagos se procesan de forma segura a través de las pasarelas habilitadas.
        </p>

        <h2>Envíos</h2>
        <p>
          Los tiempos de envío son estimados y pueden variar según la ubicación y las condiciones de la paquetería.
        </p>

        <h2>Propiedad intelectual</h2>
        <p>
          Todo el contenido de este sitio (imágenes, textos, logotipos y diseños) pertenece a Koa Macramé
          y está protegido por las leyes de derechos de autor.
        </p>

        <h2>Modificaciones</h2>
        <p>
          Koa Macramé se reserva el derecho de actualizar o modificar estos términos en cualquier momento sin previo aviso.
        </p>
      </div>

      <Footer/>
    </div>
  );
}

export default TerminosCondiciones;
