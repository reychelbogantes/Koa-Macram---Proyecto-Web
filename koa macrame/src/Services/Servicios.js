
// --- Registro de usuario ---
async function postUsers(username,email,password) {
    try {
     
        const userData = { 
            username,email,password
        
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

export { postUsers, GetUsers, cambiarPassword };