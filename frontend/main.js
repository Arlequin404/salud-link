const BACKEND_HOST = "13.216.69.108";

document.addEventListener("DOMContentLoaded", () => {
    const path = window.location.pathname;
    if (path.includes("index.html") || path === "/") {
        if (localStorage.getItem("token")) window.location.href = "home.html";

        document.getElementById("loginForm").addEventListener("submit", async (e) => {
            e.preventDefault();
            const res = await fetch(`http://${BACKEND_HOST}:8005/auth`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: document.getElementById("email").value,
                    password: document.getElementById("password").value
                })
            });

            if (res.ok) {
                const data = await res.json();
                const decoded = JSON.parse(atob(data.access_token.split('.')[1]));
                localStorage.setItem("token", data.access_token);
                localStorage.setItem("role", decoded.role);
                localStorage.setItem("email", decoded.email);
                window.location.href = "home.html";
            } else {
                alert("Credenciales incorrectas");
            }
        });

    } else if (path.includes("home.html")) {
        const token = localStorage.getItem("token");
        const role = localStorage.getItem("role");
        if (!token) return window.location.href = "index.html";

        document.getElementById("welcome").innerText = `Welcome ${localStorage.getItem("email")} (${role})`;

        loadUsers();

        if (role === "doctor") {
            document.getElementById("role").innerHTML = '<option value="paciente">Paciente</option>';
        } else if (role === "paciente") {
            document.querySelector(".tabs").style.display = "none";
            document.getElementById("actualizar").style.display = "none";
            document.getElementById("crear").style.display = "none";
        }

        const createForm = document.getElementById("createForm");
        if (createForm) {
            createForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const res = await fetch(`http://${BACKEND_HOST}:8001/users`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                        "x-role": role
                    },
                    body: JSON.stringify({
                        name: document.getElementById("name").value,
                        cedula: document.getElementById("cedula").value,
                        email: document.getElementById("new_email").value,
                        password: document.getElementById("new_password").value,
                        phone: document.getElementById("phone").value,
                        birthdate: document.getElementById("birthdate").value,
                        gender: document.getElementById("gender").value,
                        city: document.getElementById("city").value,
                        address: document.getElementById("address").value,
                        role: document.getElementById("role").value
                    })
                });
                alert(JSON.stringify(await res.json()));
                loadUsers();
            });
        }

        const editForm = document.getElementById("editUserForm");
        if (editForm) {
            editForm.addEventListener("submit", async (e) => {
                e.preventDefault();
                const id = document.getElementById("edit-id").value;
                const res = await fetch(`http://${BACKEND_HOST}:8002/users/${id}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": "Bearer " + token,
                        "x-role": role
                    },
                    body: JSON.stringify({
                        name: document.getElementById("edit-name").value,
                        cedula: document.getElementById("edit-cedula").value,
                        email: document.getElementById("edit-email").value,
                        phone: document.getElementById("edit-phone").value,
                        birthdate: document.getElementById("edit-birthdate").value,
                        gender: document.getElementById("edit-gender").value,
                        city: document.getElementById("edit-city").value,
                        address: document.getElementById("edit-address").value,
                        role: document.getElementById("edit-role").value
                    })
                });
                if (res.ok) {
                    alert("Usuario actualizado");
                    cancelEdit();
                    loadUsers();
                } else {
                    alert("Error al actualizar");
                }
            });
        }
    }
});

async function loadUsers() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    const res = await fetch(`http://${BACKEND_HOST}:8004/users`, {
        headers: {
            "Authorization": "Bearer " + token,
            "x-role": role
        }
    });
    const users = await res.json();
    window.allUsers = users;
    renderUserTable(users);
}

function renderUserTable(users) {
    const tbody = document.querySelector("#userTable tbody");
    tbody.innerHTML = "";
    for (let u of users) {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${u.cedula}</td><td>${u.name}</td><td>${u.email}</td><td>${u.role}</td>
            <td>
                <button onclick="editUser(${JSON.stringify(u).replace(/"/g, '&quot;')})">Editar</button>
                <button onclick="deleteUser('${u.id}')">Eliminar</button>
            </td>`;
        tbody.appendChild(tr);
    }
}

async function deleteUser(id) {
    const token = localStorage.getItem("token");
    await fetch(`http://${BACKEND_HOST}:8003/users/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + token,
            "x-role": localStorage.getItem("role")
        }
    });
    loadUsers();
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}

function openTab(tabId) {
    document.querySelectorAll(".tabcontent").forEach(el => el.style.display = "none");
    document.getElementById(tabId).style.display = "block";
}

function filterUsers() {
    const cedula = document.getElementById("searchCedula").value.toLowerCase();
    const role = document.getElementById("filterRole").value;
    const filtered = window.allUsers.filter(u =>
        (!cedula || u.cedula.includes(cedula)) &&
        (!role || u.role === role)
    );
    renderUserTable(filtered);
}

function editUser(user) {
    document.getElementById("edit-id").value = user.id;
    document.getElementById("edit-name").value = user.name;
    document.getElementById("edit-cedula").value = user.cedula;
    document.getElementById("edit-email").value = user.email;
    document.getElementById("edit-phone").value = user.phone || "";
    document.getElementById("edit-birthdate").value = user.birthdate || "";
    document.getElementById("edit-gender").value = user.gender || "";
    document.getElementById("edit-city").value = user.city || "";
    document.getElementById("edit-address").value = user.address || "";
    document.getElementById("edit-role").value = user.role;
    document.getElementById("edit-form-container").style.display = "block";
}

function cancelEdit() {
    document.getElementById("edit-form-container").style.display = "none";
}
