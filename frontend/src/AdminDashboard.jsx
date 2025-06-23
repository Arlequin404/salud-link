import React, { useEffect, useState } from "react";
import EditUserForm from "./EditUserForm";
import CreateUserForm from "./CreateUserForm";

const AdminDashboard = ({ userName, onLogout }) => {
  const [users, setUsers] = useState([]);
  const [filterRole, setFilterRole] = useState("todos");
  const [editingUser, setEditingUser] = useState(null);
  const [reload, setReload] = useState(false);

  const reloadUsers = () => setReload((r) => !r);

  useEffect(() => {
    const baseUrl = import.meta.env.PROD ? "" : "http://update-user:3000";
    fetch(`${baseUrl}/users`)
      .then((res) => res.json())
      .then((data) => setUsers(data))
      .catch((err) => console.error("Error al cargar usuarios:", err));
  }, [reload]);

  useEffect(() => {
    document.body.classList.toggle("modal-open", !!editingUser);
  }, [editingUser]);

  const filteredUsers =
    filterRole === "todos"
      ? users
      : users.filter((u) => u.role === filterRole);

  return (
    <div className="app-container">
      <h1 className="title">Salud-Link</h1>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>👨‍💼 Bienvenido administrador {userName}</h2>
        <button onClick={onLogout}>Cerrar Sesión</button>
      </div>

      <hr />

      <h3>📋 Usuarios registrados</h3>

      <div style={{ marginBottom: "1em" }}>
        <label>Filtrar por rol: </label>
        <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
          <option value="todos">Todos</option>
          <option value="admin">Admin</option>
          <option value="doctor">Doctor</option>
          <option value="paciente">Paciente</option>
        </select>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "2em" }}>
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.cedula}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <button onClick={() => setEditingUser(user)}>Editar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>➕ Crear nuevo usuario</h3>
      <CreateUserForm onCreate={reloadUsers} />

      {editingUser && (
        <EditUserForm
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onUpdate={reloadUsers}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
