import React, { useEffect, useState } from 'react'
import Navbar from '../../Components/NavBar/Navbar'
import Banner from '../../Components/Banner/Banner'
import { getProductos } from '../../Services/Servicios'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import WhatsAppButton from '../../Components/WhatsAppButton/WhatsAppButton';
import { FaWhatsapp } from 'react-icons/fa';
import Footer from '../../Components/Footer/Footer'


import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

import './Homepage.css'

function Homepage() {
  const [destacados, setDestacados] = useState([]);

  useEffect(() => {
    getProductos()
      .then(productos => {
        const filtrados = productos.filter(p => p.destacado && p.activo);
        setDestacados(filtrados);
      })
      .catch(console.error);
  }, []);


  return (
    <div>
      <div className='body'>
      <Navbar/>
      <Banner/>
      <br />
      <br />
      <div className='Texto-homepage'>
      <h2>¿Quienes somos?</h2>
      <br />
      <p>Este proyecto nace inspirado por la palabra “Koa” que en hawaiano significa “guerrera valiente”. Adopté esta palabra con la intención de simbolizar la lucha constante por alcanzar nuestros objetivos y superar los desafíos, ya que representa la esencia de la valentía, la determinación y la conexión con la naturaleza.
      <br /> <br />Nuestra filosofía se basa en el respeto a la tierra, es por eso que los materiales utilizados para este proyecto son amigables con el medioambiente o reciclados, como acto de reciprocidad con nuestro planeta.
      <br /> <br />Al igual que el árbol de Koa, que crece con fuerza y belleza en las islas hawaianas, aspiramos a crecer y florecer. Te invito a seguir mi proyecto y a que juntas le demos vida a Koa </p>
      <br />

    <div className="productos-destacados">
        <h2>✨ Productos destacados</h2>

        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            0: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 }
          }}
        >
          {destacados.map(prod => (
            <SwiperSlide key={prod.id}>
              <div className="card-carrusel">
                <img src={prod.foto} alt={prod.nombre} />
                <div className="overlay">
                  <button className="btn-vermas">Ver más</button>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
      
       <h2 id="pedidos-personalizados">También puedes hacer tus pedidos personalizados</h2>

       <p>Creaciones únicas en macramé hechas a mano, con diseños personalizados que llenan de estilo y calidez cualquier espacio. Encuentra piezas decorativas y accesorios elaborados con amor y detalle, o solicita tu pedido especial adaptado a tus gustos y necesidades.</p>
      
       <a
        href="https://wa.me/50687913622?text=Hola%20quiero%20información"
        className="whatsapp-btn"
        target="_blank"
        rel="noopener noreferrer">
        <FaWhatsapp size={22} style={{ marginRight: '8px' }}/> Inicia chat</a>


        <WhatsAppButton />


      </div>
        <img className='bannerFijo' src="/BannerFijo.png" alt="BannerFijo" />
         <Footer />





    </div>
    </div>
  )
}

export default Homepage