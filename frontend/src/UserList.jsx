import React, { useEffect, useState } from "react";

const UserList = () => {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await fetch("http://localhost:3010/users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      console.error("Error al obtener usuarios", err);
    }
  };

  const handleUpdate = (userId) => {
    alert(`🔄 Aquí puedes implementar la lógica para actualizar al usuario con ID: ${userId}`);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h3>👥 Lista de Usuarios</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.cedula}
            <button onClick={() => handleUpdate(user.id)}>Actualizar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
