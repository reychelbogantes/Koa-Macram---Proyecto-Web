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
⚠️ En desarrollo: módulo de **estadísticas** para admin.  
⚠️ Pendiente: integración de **Apple Pay** como pasarela de pago.  
⚠️ Mejoras de **responsividad** en versión móvil.  

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



📝 Licencia

Este proyecto está bajo la licencia MIT.
