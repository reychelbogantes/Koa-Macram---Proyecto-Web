import React from 'react';
import { FaFacebook, FaInstagram, FaTiktok, FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import './Footer.css';


function Footer() {
  return (
    <footer className="footer">
      <div className="footer-columns">

        {/* Políticas */}
        <div className="footer-col">
          <h3>Políticas</h3>
          <a href="/terminos-condiciones">Términos del servicio</a>
          <a href="/politica-reembolso">Política de reembolso</a>
        </div>

        {/* Envío */}
        <div className="footer-col">
          <h3>Envío</h3>
          <p>- Costo de envío $7</p>
          <p>- Envío gratis en compras de $1,500 o más.</p>
          <p>Nuestros paquetes se envían por correos de Costa Rica y tardan de 3 a 5 días hábiles en llegar a su destino.</p>
        </div>

        {/* Contacto */}
        <div className="footer-col">
          <h3>Contacto</h3>
          <p><FaEnvelope /> contacto@koamacrame.cr</p>
          <p><FaWhatsapp /> +506 8791 3622</p>
        </div>

        {/* Redes Sociales */}
        <div className="footer-col">
          <h3>Redes Sociales</h3>
          <div className="social-icons">
            <a href="#"><FaTiktok /></a>
            <a href="#"><FaFacebook /></a>
            <a href="https://www.instagram.com/koamacrame?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="><FaInstagram /></a>
          </div>
        </div>

      </div>

      <div className="footer-bottom">
        © 2025, KOA MACRAME de Shopify
      </div>
    </footer>
  );
}

export default Footer;
