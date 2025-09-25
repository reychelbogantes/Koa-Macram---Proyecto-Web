// --- Registro de usuario de Google ---
async function postGoogleUser(googleUser) {
  try {
    // googleUser = { googleId, name, email, picture }
    const nuevoGoogleUser = {
      ...googleUser,
      fechaRegistro: new Date().toISOString()   // ✅ fecha de registro
    };

    const response = await fetch("http://localhost:3000/Usuarios", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuevoGoogleUser)
    });

    return await response.json();
  } catch (error) {
    console.error("Error posting Google user:", error);
    throw error;
  }
}


// --- Registro de usuario ---
async function postUsers(name,email,password) {
    try {
     
        const userData = { 
            name,email,password, fechaRegistro: new Date().toISOString()  
        
        };

        const response = await fetch("http://localhost:3000/Usuarios", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(userData)
        });

     
        return await response.json();

        
    } catch (error) {
        console.error('Error posting user:', error);
        throw error;
    }
}

// --- Obtener todos los usuarios (para login y validaciones) ---
async function GetUsers(username,password) {
    try {

        const response = await fetch("http://localhost:3000/Usuarios", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            
        });

     
        return await response.json();

        
    } catch (error) {
        console.error('Error posting user:', error);
        throw error;
    }
}


// --- PATCH: Cambiar contraseña de usuario ---
async function cambiarPassword(id, nuevaPassword) {
  try {
    const response = await fetch(`http://localhost:3000/Usuarios/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: nuevaPassword }),
    });

    if (!response.ok) throw new Error("Error al cambiar contraseña");
    return await response.json();
  } catch (error) {
    console.error("Error en cambiarPassword:", error);
    throw error;
  }
}

const API_URL = "http://localhost:3000/Productos";

export async function getProductos() {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Error al obtener productos");
  return await res.json();
}

export async function postProducto(producto) {
  const nuevoProducto = {
    ...producto,
    activo: true,
    destacado: false
  };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevoProducto),
  });
  if (!res.ok) throw new Error("Error al guardar producto");
  return await res.json();
}

export async function updateProducto(id, data) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar producto");
  return await res.json();
}

export async function deleteProducto(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE"
  });
  if (!res.ok) throw new Error("Error al eliminar producto");
  return await res.json();
}

// ---- Servicios de Contacto ----
const API_CONTACTOS = "http://localhost:3000/Contactos";

export async function postContacto(contacto) {
  const nuevo = { ...contacto, fecha: new Date().toISOString() };
  const res = await fetch(API_CONTACTOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo),
  });
  if (!res.ok) throw new Error("Error al enviar contacto");
  return await res.json();
}

export async function getContactos() {
  const res = await fetch(API_CONTACTOS);
  if (!res.ok) throw new Error("Error al obtener contactos");
  return await res.json();
}

export async function getFavoritosPorUsuario(userId) {
  const res = await fetch("http://localhost:3000/Productos");
  if (!res.ok) throw new Error("Error al obtener productos");
  const productos = await res.json();

  return productos.filter(
    p => Array.isArray(p.favoritoDe) && p.favoritoDe.includes(userId)
  );
}

const API_CARRITOS = "http://localhost:3000/Carritos";
/**
 * Obtiene el carrito del usuario logueado.
 * Si no existe devuelve null.
 */
export async function getCarritoPorUsuario(userId) {
  const res = await fetch(`${API_CARRITOS}?userId=${userId}`);
  if (!res.ok) throw new Error("Error al obtener carrito");
  const carritos = await res.json();
  return carritos[0] || null; // asumimos 1 carrito por usuario
}

/**
 * Crea un carrito nuevo para el usuario.
 */
export async function crearCarrito(userId, productoId, cantidad) {
  const nuevo = {
    userId,
    productos: [{ productoId, cantidad }]
  };
  const res = await fetch(API_CARRITOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(nuevo)
  });
  if (!res.ok) throw new Error("Error al crear carrito");
  return await res.json();
}

/**
 * Actualiza productos en un carrito existente.
 */
export async function updateCarrito(idCarrito, productos) {
  const res = await fetch(`${API_CARRITOS}/${idCarrito}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ productos })
  });
  if (!res.ok) throw new Error("Error al actualizar carrito");
  return await res.json();
}

export async function vaciarCarrito(idsProductos) {
  const resp = await fetch("http://localhost:3000/Carritos");
  const items = await resp.json();
   // Filtrar los items cuyo productoId coincida con los ids seleccionados
  const borrar = items.filter(item => idsProductos.includes(item.productoId));
  await Promise.all(
    borrar.map(item =>
      fetch(`http://localhost:3000/Carritos/${item.id}`, { method: "DELETE" })
    )
  );
}

export async function guardarDireccionUsuario(idUsuario, nuevaDireccion) {
  try {
    // 1. Obtener datos del usuario actual
    const resUsuario = await fetch(`http://localhost:3000/Usuarios/${idUsuario}`);
    if (!resUsuario.ok) throw new Error("Usuario no encontrado");
    const usuario = await resUsuario.json();

    // 2. Asegurar que exista el array direccion
    const direcciones = usuario.direccion || [];

    // 3. Agregar la nueva dirección al array
    const nuevasDirecciones = [...direcciones, nuevaDireccion];

    // 4. PATCH para actualizar solo la llave direccion
    const res = await fetch(`http://localhost:3000/Usuarios/${idUsuario}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ direccion: nuevasDirecciones })
    });
    if (!res.ok) throw new Error("Error al guardar dirección");
    return await res.json();
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

// Obtiene todas las direcciones de un usuario
export async function obtenerDireccionesUsuario(idUsuario) {
  const res = await fetch(`http://localhost:3000/Usuarios/${idUsuario}`);
  if (!res.ok) throw new Error("Usuario no encontrado");
  const usuario = await res.json();
  return usuario.direccion || [];
}

// Guarda el array completo de direcciones (después de agregar/editar/eliminar)
export async function actualizarDireccionesUsuario(idUsuario, direcciones) {
  const res = await fetch(`http://localhost:3000/Usuarios/${idUsuario}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ direccion: direcciones })
  });
  if (!res.ok) throw new Error("Error al actualizar direcciones");
  return await res.json();
}

// Genera un id único para cada dirección
export function generarIdDireccion() {
  return Date.now() + "-" + Math.random().toString(36).slice(2,8);
}

export async function guardarFactura(factura) {
  const resp = await fetch("http://localhost:3000/Facturacion", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(factura)
  });
  if (!resp.ok) throw new Error("Error al guardar la factura");
  return resp.json();
}


// src/Services/ServiciosFacturas.js
const API_URLF = "http://localhost:3000/Facturacion";

/**
 * Obtiene todas las facturas
 */
export async function getFacturas() {
  const res = await fetch(API_URLF);
  if (!res.ok) {
    throw new Error("Error al obtener las facturas");
  }
  return await res.json();
}

/**
 * Obtiene una factura por ID
 * @param {string} id - ID de la factura
 */
export async function getFacturaById(id) {
  const res = await fetch(`${API_URLF}/${id}`);
  if (!res.ok) {
    throw new Error("Error al obtener la factura");
  }
  return await res.json();
}

/**
 * Crea una nueva factura
 * @param {object} factura - Objeto con los datos de la factura
 */
export async function postFactura(factura) {
  const res = await fetch(API_URLF, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(factura),
  });
  if (!res.ok) {
    throw new Error("Error al crear la factura");
  }
  return await res.json();
}

/**
 * Elimina una factura
 * @param {string} id - ID de la factura a eliminar
 */
export async function deleteFactura(id) {
  const res = await fetch(`${API_URLF}/${id}`, { method: "DELETE" });
  if (!res.ok) {
    throw new Error("Error al eliminar la factura");
  }
  return true;
}

const API_URLO = "http://localhost:3000/Ordenes";

// Obtener todas las órdenes
export async function getOrdenes() {
  const res = await fetch(API_URLO);
  if (!res.ok) throw new Error("Error al obtener las órdenes");
  return res.json();
}

// Cambiar estado de una orden (pendiente -> enviado)
export async function updateOrdenEstado(id, nuevoEstado) {
  const res = await fetch(`${API_URLO}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ estado: nuevoEstado }),
  });
  if (!res.ok) throw new Error("Error al actualizar el estado");
  return res.json();
}

export async function guardarOrden(orden) {
  const resp = await fetch("http://localhost:3000/Ordenes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orden)
  });
  if (!resp.ok) throw new Error("Error al guardar la orden");
  return await resp.json();
}

export async function getDireccionSeleccionada(userId) {
  const res = await fetch(`http://localhost:3000/Usuarios/${userId}`);
  if (!res.ok) throw new Error("Usuario no encontrado");
  const usuario = await res.json();

  // Busca la dirección que tenga seleccionada = true
  const direccionSel = (usuario.direccion || []).find(d => d.seleccionada);
  return direccionSel || null;
}


export { postUsers, GetUsers, cambiarPassword, postGoogleUser };