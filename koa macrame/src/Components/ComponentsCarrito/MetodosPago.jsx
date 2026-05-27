import React from 'react';


function MetodosPago() {
  return (
    <div className="metodos-pago">
      <h4>Aceptamos</h4>
      <div className="logos">



        <img src={`${import.meta.env.BASE_URL}Apple-pay.png`} alt="Apple-pay"/>
        <img src={`${import.meta.env.BASE_URL}Paypal.png`} alt="PayPal"/>
        {/* agrega más logos según necesites */}
      </div>
    </div>
  );
}

export default MetodosPago;
