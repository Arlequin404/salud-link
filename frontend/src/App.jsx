import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import CreateUserForm from "./CreateUserForm";
import AdminDashboard from "./AdminDashboard";


const Panel = ({ userRole, userName, onLogout }) => (
  <div className="app-container">
    <h1 className="title">Salud-Link</h1>
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <h2>Bienvenido, {userName}</h2>
      <button onClick={onLogout}>Cerrar Sesión</button>
    </div>

    {userRole === "doctor" && (
      <>
        <h3>🧑‍⚕️ Registrar Paciente</h3>
        <CreateUserForm role="paciente" />
      </>
    )}
    {userRole === "paciente" && (
      <p>Bienvenido al sistema. Contacte a su doctor para más opciones.</p>
    )}
  </div>
);

const App = () => {
  const [userRole, setUserRole] = useState(localStorage.getItem("userRole"));
  const [userName, setUserName] = useState(localStorage.getItem("userName"));

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    setUserRole(null);
    setUserName(null);
  };

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    const name = localStorage.getItem("userName");
    if (role) setUserRole(role);
    if (name) setUserName(name);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            userRole ? <Navigate to="/home" replace /> : <LoginForm setUserRole={setUserRole} setUserName={setUserName} />
          }
        />
        <Route
          path="/home"
          element={
            userRole ? (
              userRole === "admin" ? (
                <AdminDashboard userName={userName} onLogout={handleLogout} />
              ) : (
                <Panel userRole={userRole} userName={userName} onLogout={handleLogout} />
              )
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;