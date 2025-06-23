import React, { useState } from "react";

const CreateUserForm = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    cedula: "",
    name: "",
    email: "",
    password: "",
    phone: "",
    birthdate: "",
    gender: "",
    city: "",
    address: "",
    role: "paciente",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Detecta entorno: producción (docker frontend) o desarrollo local (vite)
    const baseUrl = import.meta.env.PROD ? "" : "http://localhost:8081";

    try {
      const res = await fetch(`${baseUrl}/create-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Usuario creado");
        setFormData({
          cedula: "",
          name: "",
          email: "",
          password: "",
          phone: "",
          birthdate: "",
          gender: "",
          city: "",
          address: "",
          role: "paciente",
        });
        onCreate(); // Recarga tabla de usuarios
      } else {
        const data = await res.json();
        alert("❌ Error: " + (data.message || "al crear usuario"));
      }
    } catch (error) {
      alert("❌ Error de conexión");
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="cedula" placeholder="Cédula" value={formData.cedula} onChange={handleChange} required />
      <input name="name" placeholder="Nombre" value={formData.name} onChange={handleChange} required />
      <input name="email" placeholder="Correo" value={formData.email} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} required />
      <input name="phone" placeholder="Teléfono" value={formData.phone} onChange={handleChange} />
      <input name="birthdate" type="date" value={formData.birthdate} onChange={handleChange} />
      <input name="gender" placeholder="Género" value={formData.gender} onChange={handleChange} />
      <input name="city" placeholder="Ciudad" value={formData.city} onChange={handleChange} />
      <input name="address" placeholder="Dirección" value={formData.address} onChange={handleChange} />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="admin">Administrador</option>
        <option value="doctor">Doctor</option>
        <option value="paciente">Paciente</option>
      </select>
      <button type="submit">Crear Usuario</button>
    </form>
  );
};

export default CreateUserForm;
