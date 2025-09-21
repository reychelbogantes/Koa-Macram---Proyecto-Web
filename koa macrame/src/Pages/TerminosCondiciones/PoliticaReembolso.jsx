import React from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import './LegalPages.css';

function PoliticaReembolso() {
  return (
    <div className="legal-page">
      <Navbar/>
      <br />
      <br />
      <div className="legal-container">
        <h1>Política de reembolso</h1>

        <p>
          Si decides hacer una devolución, contáctanos vía correo
          <strong> contacto@koamacrame.cr </strong> enviando la siguiente información:
        </p>
        <ul>
          <li>Motivo de la devolución.</li>
          <li>Dirección desde donde enviarás el paquete de regreso.</li>
          <li>Número de cuenta, nombre y banco en donde deseas recibir tu devolución.</li>
        </ul>

        <p>
          El producto debe ser devuelto en las mismas condiciones en las que fue adquirido
          y con el empaque original.
        </p>

        <p>
          Una vez recibido el paquete y validadas las condiciones del mismo,
          Koa Macramé abonará el coste de los productos,
          exceptuando los gastos de envío por devolución que son actualmente de
          <strong> $90 si devuelves una pieza</strong> y
          <strong> $150 si devuelves 2 o más</strong>.
        </p>

        <p>
          En caso de devoluciones mayores a 10 kg, el gasto de devolución será
          cotizado con la paquetería, y deberá ser cubierto por el cliente.
        </p>

        <p>
          El reembolso respectivo será realizado al número de cuenta enviado en el
          correo electrónico.
        </p>

        <p>
          Tienes <strong>10 días</strong> una vez recibido el producto para solicitar la devolución
          y hacer la entrega en la paquetería para su retorno.
        </p>
      </div>

      <Footer/>
    </div>
  );
}

export default PoliticaReembolso;
