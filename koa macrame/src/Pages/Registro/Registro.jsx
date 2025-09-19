import React, { useEffect } from "react"; 
import { Link, useNavigate } from 'react-router-dom';
import { postUsers, GetUsers } from '../../services/Servicios'; 
import './Registro.css'



function Registro() {
   useEffect(() => {
    const link = document.querySelector("link[rel~='icon']");
    if (link) link.href = "/favicon-32x32.png"; // nuevo favicon
    document.title = "Registro | Koa Macramé";
  }, []);


  const [username, setUsername] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState(""); 
  const [mensaje, setMensaje] = React.useState("");
  const [tipoMensaje, setTipoMensaje] = React.useState(""); // "success" | "error"

  const navigate = useNavigate();  
    
  async function PostarRegistra() { 
    try {
      // 1️⃣ Verificar que todos los campos estén llenos
      if (!username || !email || !password) {
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
      const usernameExiste = usuarios.some((u) => u.username === username);
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
      await postUsers(username, email, password);

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

  return (
    <div>
    
        <div className="form-container">
            <h2>Registro de Usuario</h2>

            <input type="text" id="username" name="username" placeholder='👤Usuario' required value={username} onChange={e => setUsername(e.target.value)}/><br />
            
            <input type="email" id="email" name="email" placeholder='📧Correo Electronico' required value={email} onChange={e => setEmail(e.target.value)} /><br />
            
            <input type="password" id="password" name="password"  placeholder='🔒 Contraseña' required value={password}  onChange={e => setPassword(e.target.value)} /><br />
            <button className="btnRegistrarse" onClick={PostarRegistra} type="submit">Registrarse </button>
            <p>¿Ya estás registrado? <br />Puedes ir a <Link to="/Login">iniciar sesión</Link></p>
             
            
             {mensaje && <p className={`mensaje ${tipoMensaje}`}>{mensaje}</p>}

        </div>




    </div>
  )
}

export default Registro