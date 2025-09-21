import { FloatingWhatsApp } from 'react-floating-whatsapp';
import  './WhatsAppButton.css'
function WhatsAppButton() {
  return (
    <FloatingWhatsApp
      className="floating-whatsapp-button"
      phoneNumber="50687913622"
      accountName="Koa Macramé"
      statusMessage="Por lo general responde dentro de un día"
      chatMessage="Hola, quiero cotizar un producto personalizado"
      avatar="/logo.png"
    />
  );
}
export default WhatsAppButton;
