// src/PacienteDashboard.jsx
import React from "react";

const PacienteDashboard = ({ onLogout }) => (
  <div className="app-container">
    <h1 className="title">Salud-Link</h1>
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h2>Panel de paciente</h2>
      <button onClick={onLogout}>Cerrar Sesión</button>
    </div>
    <p>Bienvenido al sistema. Contacte a su doctor para más opciones.</p>
  </div>
);

export default PacienteDashboard;
