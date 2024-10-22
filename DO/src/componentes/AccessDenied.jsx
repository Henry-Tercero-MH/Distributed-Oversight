// AccessDenied.jsx
import React from "react";
import "./AccessDenied.css"; // Archivo CSS para estilos

const AccessDenied = ({ message, imageUrl }) => {
  return (
    <div className="access-denied">
      <img
        src={imageUrl}
        alt="Acceso denegado"
        className="access-denied-image"
      />
      <p className="access-denied-message">{message}</p>
    </div>
  );
};

export default AccessDenied;
