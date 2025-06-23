import React from "react";
import AdminDashboard from "./AdminDashboard";
import PacienteDashboard from "./PacienteDashboard";

const Home = ({ userRole, userName }) => {
  if (!userRole) return <p>Cargando...</p>;

  return (
    <div>
      {userRole === "admin" && <AdminDashboard userName={userName} />}
      {userRole === "paciente" && <PacienteDashboard userName={userName} />}
      {userRole === "doctor" && <p>Bienvenido doctor {userName}</p>}
    </div>
  );
};

export default Home;
