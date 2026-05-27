import React, { useEffect} from 'react';
import Navbar from '../../Components/NavBar/Navbar';
import Footer from '../../Components/Footer/Footer';
import ProductosCatalogo from '../../Components/ProductosCatalogo/ProductosCatalogo';

function Catalogo() {
   // Favicon y título dinámicos
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = `${import.meta.env.BASE_URL}logo.png`;
    document.title = "Catálogo | Koa Macramé";
  }, []);
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