import React, { useEffect } from "react"; 
import { Link, useNavigate } from 'react-router-dom';
import { postUsers, GetUsers, postGoogleUser } from '../../Services/Servicios'; 
import './Registro.css'
import { GoogleLogin } from '@react-oauth/google';
import * as jwt_decode from "jwt-decode";



function Registro() {
   useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = "/logo.png";
    document.title = "Registro | Koa Macramé";
  }, []);


  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState(""); 
  const [mensaje, setMensaje] = React.useState("");
  const [tipoMensaje, setTipoMensaje] = React.useState(""); // "success" | "error"

  const navigate = useNavigate();  
    
  async function PostarRegistra() { 
    try {
      // 1️⃣ Verificar que todos los campos estén llenos
      if (!name || !email || !password) {
        setTipoMensaje("error");
        setMensaje("⚠️ Todos los campos son obligatorios");
        return;
      }

      // 2️⃣ Verificar que el email tenga un "@"
      if (!email.includes("@")) {
        setTipoMensaje("error");
        setMensaje("⚠️ El correo electrónico no es válido");
        return;
      }

      // 3️⃣ Verificar que la contraseña tenga al menos 8 caracteres
      if (password.length < 8) {
        setTipoMensaje("error");
        setMensaje("⚠️ La contraseña debe tener al menos 8 caracteres");
        return;
      }

      // 4️⃣ Verificar si el usuario ya existe
      const usuarios = await GetUsers();
      const usernameExiste = usuarios.some((u) => u.name === name);
      const emailExiste = usuarios.some((u) => u.email === email);

      if (usernameExiste) {
        setTipoMensaje("error");
        setMensaje("❌ El nombre de usuario ya está en uso");
        return;
      }

      if (emailExiste) {
        setTipoMensaje("error");
        setMensaje("❌ El correo electrónico ya está registrado");
        return;
      }

      // ✅ Si pasa todas las validaciones → registrar
      await postUsers(name, email, password);

      setTipoMensaje("success");
      setMensaje("✅ Registro exitoso, redirigiendo...");

      setTimeout(() => {
        navigate("/Login");
      }, 1500);

    } catch (error) {
      setTipoMensaje("error");
      setMensaje("❌ Error al registrar, intenta de nuevo");
      console.error(error);
    }

   }

  const handleSuccess = async (credentialResponse) => {
  try {
    const decoded = jwt_decode.default(credentialResponse.credential);
    console.log("Usuario de Google:", decoded);

    // Construir objeto usuario
    const user = {
      googleId: decoded.sub,
      name: decoded.name,
      email: decoded.email,
      picture: decoded.picture
    };

    // 1️⃣ Obtener todos los usuarios
    const usuarios = await GetUsers();

    // 2️⃣ Verificar si ya existe por googleId o email
    const usuarioExistente = usuarios.find(
      u => u.googleId === user.googleId || u.email === user.email
    );

    if (usuarioExistente) {
      console.log("Usuario ya registrado:", usuarioExistente);
      setMensaje("Ingreso con Google exitoso ✅");
      localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioExistente));
    } else {
      // 3️⃣ Guardar en db.json si no existe
      const savedUser = await postGoogleUser(user);
      console.log("Usuario guardado en db.json:", savedUser);
      setMensaje("Ingreso con Google exitoso ✅");
      localStorage.setItem("usuarioLogueado", JSON.stringify(savedUser));
    }

    setTimeout(() => navigate("/homepage"), 1000);

  } catch (error) {
    console.error("Error al procesar login con Google:", error);
    setMensaje("Error al iniciar sesión con Google ❌");
  }
};
  // Google Login - error
  const handleError = () => {
    console.error("Error en el inicio de sesión con Google");
    setMensaje("Error al iniciar sesión con Google ❌");
  };

  return (
    <div>
     <div className="registro-wrapper">
      
      {/* --- Columna izquierda con imagen y logo --- */}
      <div className="left-side">
        <img className="logo" src="/logo.png" alt="Koa Macramé" />
      </div>

      {/* --- Columna derecha con el formulario --- */}
      <div className="right-side">
        <div className="form-box">
          <h2>Crear una cuenta</h2>

          <div className="social-buttons">
             <div className="google-login">
                <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
              </div>
               {/* --- 
            <button>
              <img src="/facebook-icon.svg" alt="Facebook" />
              Regístrate con Facebook
            </button>--- */}
          </div>

          <div className="separator">- o -</div>

          <input
            type="text"
            placeholder="Nombre completo"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          <button className="btnRegistrarse" onClick={PostarRegistra}>Crear una cuenta</button>

          <p>¿Ya tienes una cuenta? <Link to="/Login">Iniciar sesión</Link></p>

          {mensaje && <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>}
        </div>
      </div>
    </div>
  </div>
  )
}


export default Registro