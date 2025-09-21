import React from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import ProductosCatalogo from '../../Components/ProductosCatalogo/ProductosCatalogo';

function Catalogo() {
  return (
    <>
    <div className='body'>
      <Navbar/>
      <br />
      <br />
      <br />
      <ProductosCatalogo/>
      <Footer/>
      </div>
    </>
  );
}

export default Catalogo;