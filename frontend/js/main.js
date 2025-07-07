/* ------------------------------------------------------
   frontend/js/main.js
------------------------------------------------------ */

/* 1 │ Config común ---------------------------------------------------- */
const API_AUTH_PORT = 8005;  // puerto del microservicio auth
const HOST_BACKEND   = location.hostname === 'localhost'
                     ? 'localhost'
                     : '13.216.69.108';  // Cambiar por la IP o URL de tu backend

/* rutas base de las vistas */
const VIEW_ROOT = '/views/';
const LOGIN_PAGE  = `${VIEW_ROOT}login.html`;
const HOME_PAGE   = `${VIEW_ROOT}home.html`;  // Nueva ruta para home.html

/* 2 │ Utilidades sencillas ------------------------------------------- */
const go = path => location.href = path;  // navegación rápida
const qs = sel  => document.querySelector(sel);  // atajo DOM

/* 3 │ Manejamos cada pantalla según path ----------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  const path = location.pathname;

  /* ───────────── LOGIN ───────────── */
  if (path.endsWith('/login.html') || path === '/' || path === '/index.html') {
    const form = qs('#loginForm');
    if (!form) return;  // tamper-proof

    form.addEventListener('submit', async e => {
      e.preventDefault();
      const email    = qs('#loginEmail').value.trim();
      const password = qs('#loginPassword').value;

      try {
        const res = await fetch(`http://${HOST_BACKEND}:${API_AUTH_PORT}/auth`, {
          method : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body   : JSON.stringify({ email, password })
        });
        
        if (!res.ok) throw new Error('Credenciales incorrectas');

        const { access_token } = await res.json();
        const payload = JSON.parse(atob(access_token.split('.')[1])); // Decodificar el token

        // Guardar datos del usuario en localStorage
        localStorage.setItem('token', access_token);
        localStorage.setItem('role', payload.role);
        localStorage.setItem('email', payload.email);

        // Redirigir a home.html después del login exitoso
        go(HOME_PAGE);
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    });
    return;  // no ejecutar el resto
  }

  /* ───────────── OTRAS PANTALLAS ───────────── */
  // Si no hay token guardado, vuelve al login
  if (!localStorage.getItem('token')) go(LOGIN_PAGE);

  // Añadir la funcionalidad para cerrar sesión
  const logoutBtn = qs('#logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', e => {
      e.preventDefault();
      localStorage.clear();  // Limpiar datos del usuario
      go(LOGIN_PAGE);        // Redirigir al login
    });
  }
});
