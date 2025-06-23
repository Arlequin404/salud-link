import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = ({ setUserRole, setUserName }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Usar variable de entorno para API base
  const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:3000";

  const login = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`${baseUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Respuesta del backend:", data);

        const role = data?.user?.role;
        const name = data?.user?.name;

        if (role && name) {
          localStorage.setItem("userRole", role);
          localStorage.setItem("userName", name);
          setUserRole(role);
          setUserName(name);
          navigate("/home");
        } else {
          alert("❌ No se pudo identificar el usuario.");
        }
      } else {
        alert("❌ Credenciales inválidas");
      }
    } catch (err) {
      alert("❌ Error de conexión con el servidor");
      console.error(err);
    }
  };

  return (
    <form className="form-container" onSubmit={login}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        placeholder="Correo"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Ingresar</button>
    </form>
  );
};

export default LoginForm;
