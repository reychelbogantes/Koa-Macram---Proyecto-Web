# 🧵 Koa Macramé  

Plataforma de e-commerce para un emprendimiento de **macramé hecho a mano**.  
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
