import React from "react";
import { Navigate } from "react-router-dom";

function RutaPrivada({ children }) {
  const usuario = JSON.parse(localStorage.getItem("usuarioLogueado") || "null");

  if (!usuario) {
    // 🔒 No logueado → redirige a login
    return <Navigate to="/login" replace />;
  }

  if (usuario.rol !== "admin") {
    // 🔒 Logueado pero sin rol admin → redirige a homepage
    return <Navigate to="/" replace />;
  }

  // ✅ Usuario admin → muestra el contenido
  return children;
}

export default RutaPrivada;
