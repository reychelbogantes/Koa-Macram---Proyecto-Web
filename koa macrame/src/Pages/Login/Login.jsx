import React, { useState, useEffect } from "react"; 
import { GetUsers, cambiarPassword, postGoogleUser } from '../../Services/Servicios'; 
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

import { GoogleLogin } from "@react-oauth/google";
import * as jwt_decode from "jwt-decode";

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState(''); 
  const [mensaje, setMensaje] = useState('');
  const [logueado, setLogueado] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [userCheck, setUserCheck] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [verifiedUser, setVerifiedUser] = useState(null);

  const navigate = useNavigate();

  // Favicon y título dinámicos
  useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = "/logo.png";
    document.title = "Inicio Sesión | Koa Macramé";
  }, []);

  // Login normal
  const CargarIngreso = async () => {
    if (logueado) {
      setLogueado(false);
      localStorage.removeItem("usuarioLogueado");
      setMensaje("Sesión cerrada ✅");
    } else {
      try {
        const usuarios = await GetUsers();
        const usuarioValido = usuarios.find(
          u => u.username === username && u.password === password
        );

        if (usuarioValido) {
          setMensaje("Ingreso exitoso ✅");
          setLogueado(true);
          localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioValido));
          setTimeout(() => navigate("/Index"), 1000);
        } else {
          setMensaje("Usuario o contraseña incorrectos ❌");
        }
      } catch (error) {
        setMensaje("Error al ingresar ❌");
        console.error(error);
      }
    }
  };

  // Abrir modal
  const handleOlvide = () => {
    setShowModal(true);
    setUserCheck('');
    setNewPassword('');
    setVerifiedUser(null);
    setMensaje('');
  };

  // Verificar usuario/email
  const handleVerificarUsuario = async () => {
    try {
      const usuarios = await GetUsers();
      const usuarioValido = usuarios.find(
        u => u.username === userCheck || u.email === userCheck
      );
      if (usuarioValido) {
        setVerifiedUser(usuarioValido);
        setMensaje("Usuario verificado ✅");
      } else {
        setMensaje("Usuario o correo no encontrado ❌");
      }
    } catch (error) {
      setMensaje("Error al verificar usuario ❌");
      console.error(error);
    }
  };

  // Cambiar contraseña
  const handleCambiarPassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      setMensaje("La contraseña debe tener mínimo 8 caracteres ❌");
      return;
    }

    try {
      await cambiarPassword(verifiedUser.id, newPassword); // PATCH con id del usuario
      setMensaje("Contraseña cambiada ✅");
      setShowModal(false);
    } catch (error) {
      setMensaje("Error al cambiar contraseña ❌");
      console.error(error);
    }
  };

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
    <div className="login-layout">

      {/* Columna Izquierda: El formulario */}
      <div className="form-container">
        <img className="Logo"
          src="/logo.png"
          alt="Logo"
        />
        <h2>Iniciar sesión</h2>
        <p>Introduzca sus datos</p>

        <div className="inputs-row">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="👤 Usuario"
            required
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            id="password"
            name="password"
            placeholder="🔒 Contraseña"
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
         <button className="link-button" onClick={handleOlvide}>
          ¿Olvidaste tu contraseña?
        </button>

        {mensaje && (
          <p className={`mensaje ${mensaje.includes('✅') ? 'exito' : ''}`}>
            {mensaje}
          </p>
        )}

        <button className="Iniciar-sesion" onClick={CargarIngreso} type="submit">
          Iniciar sesión
        </button> <br />

        <div className="google-login">
         <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
        </div>

        <p>
          ¿Todavía no estás registrado? <br />
          Puedes ir a <Link to="/Registro">registrarte</Link>
        </p>

       
      </div>

      {/* Columna Derecha: La imagen */}
      <div className="image-container">
        <img
          src="/arreglo-de-macrame-boho-en-interiores.jpg"
          alt="Ilustración de inicio de sesión"
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            {!verifiedUser ? (
              <>
                <h3>Verificar usuario o correo</h3>
                <input
                  type="text"
                  placeholder="Usuario o correo"
                  value={userCheck}
                  onChange={e => setUserCheck(e.target.value)}
                />
                {mensaje && <p className="mensaje">{mensaje}</p>}
                <button onClick={handleVerificarUsuario}>Verificar</button>
              </>
            ) : (
              <>
                <h3>Cambiar contraseña</h3>
                <input
                  type="password"
                  placeholder="Nueva contraseña"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                />
                {mensaje && <p className="mensaje">{mensaje}</p>}
                <button onClick={handleCambiarPassword}>Guardar</button>
              </>
            )}
            <button onClick={() => setShowModal(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Login