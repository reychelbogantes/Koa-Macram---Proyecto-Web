# 🧵 Koa Macramé  

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)  
![React](https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white)  
![Vite](https://img.shields.io/badge/Vite-5-purple?logo=vite&logoColor=white)  
![PayPal](https://img.shields.io/badge/PayPal-integrado-00457C?logo=paypal)  
![Apple Pay](https://img.shields.io/badge/Apple%20Pay-pendiente-lightgrey?logo=apple)  
![JSON Server](https://img.shields.io/badge/JSON--Server-API%20Fake-red)  

![Google OAuth](https://img.shields.io/badge/Login%20Google-OAuth%202.0-blue?logo=google)  
![Carrito](https://img.shields.io/badge/Carrito-Dinámico-green)  
![Favoritos](https://img.shields.io/badge/Favoritos-Disponible-pink)  
![Dashboard](https://img.shields.io/badge/Dashboard-Administración-orange)  
![Responsivo](https://img.shields.io/badge/UI-Responsivo-success)  
![Estadísticas](https://img.shields.io/badge/Estadísticas-ECharts-blueviolet)  

Plataforma de **e-commerce** para un emprendimiento de **macramé hecho a mano**.  
Los usuarios pueden explorar productos, registrarse, gestionar un carrito de compras, pagar con **PayPal**, y los administradores tienen acceso a un **dashboard interno** para manejar inventario, usuarios y facturación.  

---

## 🚀 Características  

### 👤 Usuarios  
- Registro e inicio de sesión (manual o con Google OAuth).  
- Gestión de direcciones de envío.  
- Carrito dinámico con actualización de cantidades.  
- Guardar productos como favoritos.  
- Proceso de compra con envío (**Correo de Costa Rica** / **retiro local**).  
- Pago seguro con **PayPal**.  
- Historial de órdenes y facturas.  

### 🛠️ Administradores  
- Dashboard con menú lateral para gestión interna.  
- Módulos: Inventario, Usuarios, Contactos, Facturas, Órdenes Pendientes, Canceladas y Finalizadas.  
- Estadísticas con gráficas.  
- Control de productos (activar/desactivar, destacar, precios, imágenes).  

---

## 📌 Estado del Proyecto  

✅ Login/Registro funcionando con validaciones.  
✅ Carrito de compras con cantidades dinámicas.  
✅ Checkout con **PayPal** integrado.  
✅ Dashboard de administración básico funcionando.  
✅ Módulo de **estadísticas** para admin.  
✅ **Responsividad** en versión móvil.  
⚠️ Pendiente: integración de **Apple Pay** como pasarela de pago.  

---

## 📂 Estructura del Proyecto  

```bash
src/
 ├── Components/
 │   ├── NavBar/
 │   ├── Footer/
 │   ├── Inventario/
 │   ├── ProductosAdmin/
 │   ├── UsuariosAdmin/
 │   ├── FacturasAdmin/
 │   ├── OrdenesPendientes/
 │   ├── OrdenesFinalizadas/
 │   └── ...
 ├── Pages/
 │   ├── Login/
 │   ├── Registro/
 │   ├── Homepage/
 │   ├── Catalogo/
 │   ├── Contactanos/
 │   └── Admin/
 ├── Services/
 │   └── Servicios.js
 ├── App.jsx
 └── main.jsx
```

---

## 🔧 Tecnologías y Librerías Utilizadas  

### ⚛️ Core del Proyecto  
- **React 19 + Vite** → Framework principal para construir la interfaz de usuario y Vite como bundler rápido para desarrollo.  
- **react-router-dom** → Manejo de rutas entre páginas (Login, Registro, Catálogo, Admin, etc.).  
- **react-router-hash-link** → Navegación con anclas suaves dentro de la misma página (scroll automático a secciones).  

### 🔑 Autenticación y Seguridad  
- **@react-oauth/google** → Login con Google OAuth 2.0.  
- **jwt-decode** → Decodificación de tokens JWT (usado para validar datos de usuarios que inician sesión con Google).  

### 💳 Pasarelas de Pago  
- **@paypal/react-paypal-js** → SDK de PayPal para integrar pagos dentro del flujo de compra.  
- *(En desarrollo: planeada integración con Apple Pay).*  

### 🖼️ UI y Experiencia de Usuario  
- **react-icons** → Conjunto de íconos listos para usar en botones, navbar, modales, etc.  
- **swiper** → Carrusel responsivo y moderno para mostrar productos destacados.  
- **react-slick + slick-carousel** → Otro sistema de carrusel para productos o banners (similar a Swiper).  
- **react-floating-whatsapp** → Botón flotante para contacto directo vía WhatsApp.  

### 📊 Visualización de Datos  
- **echarts** + **echarts-for-react** → Librería de gráficos y estadísticas (usada en el Dashboard de administración para mostrar métricas de ventas, productos y usuarios).  

### 🌐 Backend Fake (API de Desarrollo)  
- **json-server** → Simulación de un backend REST con `db.json` para productos, usuarios, carritos, órdenes, etc.  

---
