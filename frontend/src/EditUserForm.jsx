// src/EditUserForm.jsx
import React, { useState, useEffect } from "react";

const EditUserForm = ({ user, onClose, onUpdate }) => {
  const [formData, setFormData] = useState(user);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:3010/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Usuario actualizado correctamente");
        onUpdate(); // Recargar lista
        onClose();
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  return (
    <div className="modal">
      <h3>✏️ Editar Usuario</h3>
      <form onSubmit={handleSubmit}>
        <input name="name" value={formData.name || ""} onChange={handleChange} placeholder="Nombre" />
        <input name="email" value={formData.email || ""} onChange={handleChange} placeholder="Correo" />
        <input name="cedula" value={formData.cedula || ""} onChange={handleChange} placeholder="Cédula" />
        <input name="phone" value={formData.phone || ""} onChange={handleChange} placeholder="Teléfono" />
        <input name="birthdate" type="date" value={formData.birthdate?.slice(0, 10) || ""} onChange={handleChange} />
        <input name="gender" value={formData.gender || ""} onChange={handleChange} placeholder="Género" />
        <input name="city" value={formData.city || ""} onChange={handleChange} placeholder="Ciudad" />
        <input name="address" value={formData.address || ""} onChange={handleChange} placeholder="Dirección" />
        <select name="role" value={formData.role || ""} onChange={handleChange}>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="paciente">Paciente</option>
        </select>
        <button type="submit">Actualizar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
};

export default EditUserForm;
