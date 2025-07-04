// js/doctor/index.js

const HOST          = 'localhost';
const PORT_CREATE   = 8006;
const PORT_LIST     = 8007;
const PORT_GET      = 8008;
const PORT_UPDATE   = 8009;
const PORT_DELETE   = 8010;
const PORT_SCHEDULE = 8012;

const token = localStorage.getItem('token');
const hdr = () => ({
  'Authorization': 'Bearer ' + token,
  'x-role': 'admin',
  'Content-Type': 'application/json'
});

const dlgDoctor      = document.getElementById('dlgDoctor');
const dlgSchedule    = document.getElementById('dlgSchedule');
const addSchedBtn    = document.getElementById('addScheduleBtn');
const scheduleForm   = document.getElementById('scheduleForm');
let _doctorList      = [];
let _scheduleList    = [];

/** RENDER DOCTORES **/
function renderDoctors(list) {
  const tbody = document.querySelector('#doctorTable tbody');
  tbody.innerHTML = '';
  for (const d of list) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${d.cedula}</td>
      <td>${d.name}</td>
      <td>${d.specialty}</td>
      <td>
        <button onclick="editDoctor('${d.cedula}')" class="btn">Editar</button>
        <button onclick="deleteDoctor('${d.cedula}')" class="btn">Eliminar</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

/** CARGA DOCTORES **/
async function loadDoctors() {
  try {
    const res = await fetch(`http://${HOST}:${PORT_LIST}/api/doctors`, { headers: hdr() });
    if (!res.ok) throw new Error(res.statusText);
    _doctorList = await res.json();
    renderDoctors(_doctorList);
  } catch (e) {
    console.error(e);
    alert('No se pudieron cargar los doctores.');
  }
}

/** RENDER TURNOS **/
function renderSchedules(list) {
  const tbody = document.querySelector('#scheduleTable tbody');
  tbody.innerHTML = '';
  for (const s of list) {
    const dayNames = ['','Lun','Mar','Mié','Jue','Vie','Sáb','Dom'];
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${dayNames[s.day_of_week]}</td>
      <td>${s.start_time}</td>
      <td>${s.end_time}</td>
      <td>
        <button onclick="editSchedule(${s.schedule_id})" class="btn">✎</button>
        <button onclick="deleteSchedule(${s.schedule_id})" class="btn">✖</button>
      </td>`;
    tbody.appendChild(tr);
  }
}

/** CARGA TURNOS **/
async function loadSchedules(cedula) {
  try {
    const res = await fetch(
      `http://${HOST}:${PORT_SCHEDULE}/api/doctors/${cedula}/schedule`,
      { headers: hdr() }
    );
    if (!res.ok) throw new Error(res.statusText);
    _scheduleList = await res.json();
    renderSchedules(_scheduleList);
  } catch (e) {
    console.error(e);
    alert('No se pudieron cargar los turnos.');
  }
}

/** ABRIR FORM de NUEVO TURNO **/
addSchedBtn.addEventListener('click', () => {
  document.getElementById('s-id').value = '';
  document.getElementById('s-dayOfWeek').value = '1';
  document.getElementById('s-startTime').value = '';
  document.getElementById('s-endTime').value = '';
  dlgSchedule.showModal();
});

/** GUARDAR TURNO **/
scheduleForm.onsubmit = async e => {
  e.preventDefault();
  const cedula = document.getElementById('d-cedula').value;
  const id     = document.getElementById('s-id').value;
  const body = {
    day_of_week: parseInt(document.getElementById('s-dayOfWeek').value),
    start_time:  document.getElementById('s-startTime').value,
    end_time:    document.getElementById('s-endTime').value
  };
  const isNew  = !id;
  const url    = isNew
    ? `http://${HOST}:${PORT_SCHEDULE}/api/doctors/${cedula}/schedule`
    : `http://${HOST}:${PORT_SCHEDULE}/api/doctors/${cedula}/schedule/${id}`;
  const method = isNew ? 'POST' : 'PUT';

  const res = await fetch(url, {
    method, headers: hdr(), body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json();
    return alert('Error turno: ' + err.error);
  }
  dlgSchedule.close();
  loadSchedules(cedula);
};

/** EDITAR TURNO **/
window.editSchedule = async id => {
  const cedula = document.getElementById('d-cedula').value;
  const s = _scheduleList.find(x => x.schedule_id === id);
  if (!s) return;
  document.getElementById('s-id').value        = s.schedule_id;
  document.getElementById('s-dayOfWeek').value = s.day_of_week;
  document.getElementById('s-startTime').value = s.start_time;
  document.getElementById('s-endTime').value   = s.end_time;
  dlgSchedule.showModal();
};

/** BORRAR TURNO **/
window.deleteSchedule = async id => {
  if (!confirm('¿Borrar este turno?')) return;
  const cedula = document.getElementById('d-cedula').value;
  try {
    const res = await fetch(
      `http://${HOST}:${PORT_SCHEDULE}/api/doctors/${cedula}/schedule/${id}`,
      { method: 'DELETE', headers: hdr() }
    );
    if (!res.ok) throw new Error(await res.text());
    loadSchedules(cedula);
  } catch (e) {
    console.error(e);
    alert('No se pudo eliminar el turno.');
  }
};

/** Guardar / editar DOCTOR **/
document.getElementById('doctorForm').onsubmit = async e => {
  e.preventDefault();
  const body = {
    user_id:          document.getElementById('d-userId').value,
    cedula:           document.getElementById('d-cedula').value,
    name:             document.getElementById('d-name').value,
    email:            document.getElementById('d-email').value,
    specialty:        document.getElementById('d-specialty').value,
    phone_mobile:     document.getElementById('d-phoneMobile').value,
    phone_off:        document.getElementById('d-phoneOff').value,
    hospital_name:    document.getElementById('d-hospitalName').value,
    hospital_address: document.getElementById('d-hospitalAddress').value,
    department:       document.getElementById('d-department').value,
    shift_type:       document.getElementById('d-shiftType').value,
    years_experience: parseInt(document.getElementById('d-yearsExperience').value) || 0,
    license_number:   document.getElementById('d-licenseNumber').value
  };

  const isNew = document.getElementById('d-cedula').readOnly === false;
  const url   = isNew
    ? `http://${HOST}:${PORT_CREATE}/api/doctor`
    : `http://${HOST}:${PORT_UPDATE}/api/doctor/${body.cedula}`;
  const method = isNew ? 'POST' : 'PUT';

  const res = await fetch(url, {
    method, headers: hdr(), body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json();
    return alert('Error: ' + err.error);
  }
  dlgDoctor.close();
  loadDoctors();
};

/** EDITAR DOCTOR y cargar sus turnos **/
window.editDoctor = async cedula => {
  try {
    const res = await fetch(`http://${HOST}:${PORT_GET}/api/doctor/${cedula}`, { headers: hdr() });
    if (!res.ok) throw new Error(await res.text());
    const d = await res.json();

    document.getElementById('d-userId').value           = d.doctor_id;
    document.getElementById('d-name').value             = d.name || '';
    document.getElementById('d-cedula').value           = d.cedula;
    document.getElementById('d-email').value            = d.email || '';
    document.getElementById('d-specialty').value        = d.specialty || '';
    document.getElementById('d-phoneMobile').value      = d.phone_mobile || '';
    document.getElementById('d-phoneOff').value         = d.phone_off || '';
    document.getElementById('d-hospitalName').value     = d.hospital_name || '';
    document.getElementById('d-hospitalAddress').value  = d.hospital_address || '';
    document.getElementById('d-department').value       = d.department || '';
    document.getElementById('d-shiftType').value        = d.shift_type || '';
    document.getElementById('d-yearsExperience').value  = d.years_experience || '';
    document.getElementById('d-licenseNumber').value    = d.license_number || '';

    document.getElementById('d-cedula').readOnly = true;
    dlgDoctor.showModal();
    loadSchedules(cedula);
  } catch (e) {
    console.error(e);
    alert('No se pudo obtener los datos del doctor.');
  }
};

async function deleteDoctor(cedula) {
  if (!confirm(`¿Seguro que quieres borrar al doctor ${cedula}?`)) return;
  try {
    const res = await fetch(`http://${HOST}:${PORT_DELETE}/api/doctor/${cedula}`, {
      method: 'DELETE', headers: hdr()
    });
    if (!res.ok) throw new Error(await res.text());
    loadDoctors();
  } catch (e) {
    console.error(e);
    alert('No se pudo eliminar el doctor.');
  }
}

function searchDoctor() {
  const term = document.getElementById('searchDoctor').value.trim();
  renderDoctors(
    term
      ? _doctorList.filter(d => d.cedula.includes(term))
      : _doctorList
  );
}

function openTab(id) {
  document.querySelectorAll('.tabcontent').forEach(el => el.style.display = 'none');
  document.getElementById(id).style.display = 'block';
}

function logout() {
  localStorage.clear();
  location = '../index.html';
}

// Exports globales
window.editDoctor   = editDoctor;
window.deleteDoctor = deleteDoctor;
window.openTab      = openTab;
window.logout       = logout;
window.loadDoctors  = loadDoctors;
window.searchDoctor = searchDoctor;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('refreshBtn').addEventListener('click', loadDoctors);
  document.getElementById('searchBtn').addEventListener('click', searchDoctor);
  document.getElementById('tabRoleUsers').addEventListener('click', () =>
    openTab('usuariosDoctor')
  );
  document.getElementById('tabRegistered').addEventListener('click', () =>
    openTab('doctoresRegistrados')
  );
  document.getElementById('logoutBtn').addEventListener('click', logout);

  openTab('doctoresRegistrados');
  loadDoctors();
});
