/* ------------------------------------------------------
   frontend/js/user/index.js
   ------------------------------------------------------ */

/* ============ CONFIG ============ */
const API  = { c: 8001, u: 8002, d: 8003, l: 8004 };
const HOST = location.hostname || 'localhost';

/* ============ SESIÓN ============ */
const token = localStorage.getItem('token');
const role  = localStorage.getItem('role');
const email = localStorage.getItem('email');

if (!token) location.href = '../login.html';

document.getElementById('welcome').textContent =
  `Bienvenido ${email} (${role})`;

/* ============ HELPERS ============ */
const headers = () => ({
  'Content-Type': 'application/json',
  Authorization : `Bearer ${token}`,
  'x-role'      : role,
});
const $ = id => document.getElementById(id)?.value || '';

/* ============ NAVEGACIÓN ============ */
function openTab(id) {
  document.querySelectorAll('.tabcontent')
          .forEach(el => (el.style.display = 'none'));
  document.getElementById(id).style.display = 'block';
}
function toggleEdit(show) {
  document.getElementById('editUserForm')
          .classList.toggle('hidden', !show);
}
function logout() {
  localStorage.clear();
  location.href = '../login.html';
}
Object.assign(window, { openTab, toggleEdit, logout });

/* ============ CRUD ============ */
async function loadUsers() {
  try {
    const r = await fetch(`http://${HOST}:${API.l}/users`, { headers: headers() });
    if (!r.ok) throw new Error(await r.text());
    window.USERS = await r.json();
    render(window.USERS);
  } catch (err) {
    alert('❌ No se pudo cargar la lista de usuarios\n' + err);
    console.error(err);
  }
}

async function del(id) {
  try {
    const r = await fetch(
      `http://${HOST}:${API.d}/users/${encodeURIComponent(id)}`,
      { method: 'DELETE', headers: headers() },
    );
    if (!r.ok) throw new Error(await r.text());
    loadUsers();
  } catch (err) {
    alert('❌ No se pudo eliminar el usuario\n' + err);
    console.error(err);
  }
}

/* ---------- EDITAR ---------- */
async function edit(uBasic) {
  let u = { ...uBasic };
  const missing = ['phone', 'birthdate', 'gender', 'city', 'address', 'password']
                  .some(f => !uBasic[f]);
  if (missing) {
    try {
      const res = await fetch(
        `http://${HOST}:${API.l}/users/${encodeURIComponent(uBasic.id)}`,
        { headers: headers() }
      );
      if (res.ok) u = { ...u, ...(await res.json()) };
    } catch (e) {
      console.error('Error obteniendo detalle:', e);
    }
  }
  fillEditForm(u);
}

function fillEditForm(u) {
  toggleEdit(true);
  const map = {
    id: 'edit-id',         name: 'edit-name',    cedula: 'edit-cedula',
    email: 'edit-email',   phone: 'edit-phone',  birthdate: 'edit-birthdate',
    gender: 'edit-gender', city: 'edit-city',    address: 'edit-address',
    role: 'edit-role',     password: 'edit-password'  // Añadimos el campo de contraseña aquí
  };
  for (const [k, id] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.value = u[k] ?? '';
  }
}
Object.assign(window, { edit, del });

/* ============ RENDER TABLA ============ */
const fmtDate = d => d ? new Date(d).toLocaleDateString() : '—';

function render(list) {
  const tbody = document.querySelector('#userTable tbody');
  tbody.innerHTML = '';

  list.forEach(u => {
    const tr   = document.createElement('tr');
    const data = JSON.stringify(u).replace(/"/g, '&quot;');

    tr.innerHTML = `
      <td>${u.cedula}</td>
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.phone ?? '—'}</td>
      <td>${fmtDate(u.birthdate)}</td>
      <td>${u.gender ?? '—'}</td>
      <td>${u.city ?? '—'}</td>
      <td>${u.address ?? '—'}</td>
      <td>${u.role}</td>
      <td>${role === "admin" ? u.password : '—'}</td> <!-- Mostrar la contraseña solo si es admin -->
      <td>
        <button onclick="edit(${data})">Editar</button>
        <button onclick="del('${u.id}')">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  });
}

/* ============ FORMULARIO CREAR ============ */
document.getElementById('createForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    name: $('name'),       cedula: $('cedula'),   email: $('email'),
    password: $('password'), phone: $('phone'),   birthdate: $('birth'),
    gender: $('gender'),   city: $('city'),       address: $('address'),
    role: $('role'),
  };
  try {
    const r = await fetch(`http://${HOST}:${API.c}/users`, {
      method: 'POST', headers: headers(), body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(await r.text());
    e.target.reset();
    await loadUsers();
    openTab('actualizar');
  } catch (err) {
    alert('❌ No se pudo crear el usuario\n' + err);
  }
});

/* ============ FORMULARIO EDITAR ============ */
document.getElementById('editUserForm').addEventListener('submit', async e => {
  e.preventDefault();
  const body = {
    name: $('edit-name'),   cedula: $('edit-cedula'), email: $('edit-email'),
    phone: $('edit-phone'), birthdate: $('edit-birthdate'),
    gender: $('edit-gender'), city: $('edit-city'),
    address: $('edit-address'), role: $('edit-role'),
  };
  try {
    const r = await fetch(
      `http://${HOST}:${API.u}/users/${encodeURIComponent($('edit-id'))}`,
      { method: 'PUT', headers: headers(), body: JSON.stringify(body) }
    );
    if (!r.ok) throw new Error(await r.text());
    toggleEdit(false);
    loadUsers();
  } catch (err) {
    alert('❌ No se pudo actualizar el usuario\n' + err);
  }
});

/* ============ FILTRO ============ */
function filterUsers() {
  const q        = $('searchCedula').toLowerCase();
  const roleSel  = $('filterRole');      // value="" para Todos
  render(
    window.USERS.filter(u =>
      (!q || u.cedula.includes(q)) &&
      (!roleSel || u.role === roleSel)
    )
  );
}
window.filterUsers = filterUsers;

/* ============ INIT ============ */
loadUsers();
openTab('actualizar');
