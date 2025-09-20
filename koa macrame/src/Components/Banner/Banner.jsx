import React from "react";
import Slider from "react-slick";
import "./Banner.css";


function Banner() {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false, // sin flechas, solo dots
    fade: true     // efecto de desvanecido entre imágenes
  };

  return (
    <div className="banner-container">
      {/* Carrusel de imágenes */}
      <Slider {...settings} className="banner-slider">
        <div><img src="/banner1.jpg" alt="slide 1" /></div>
        <div><img src="/banner2.jpg" alt="slide 2" /></div>
        <div><img src="/banner3.jpg"alt="slide 3" /></div>
        <div><img src="/banner4.jpg"alt="slide 4" /></div>
        <div><img src="/banner5.jpg"alt="slide 5" /></div>
      </Slider>

      {/* Capa oscura */}
      <div className="banner-overlay"></div>

      {/* Logo fijo al centro */}
      <div className="banner-logo">
        <img src="/logo.png" alt="Logo Koa Macramé" />
      </div>
    </div>
  );
}

export default Banner;
