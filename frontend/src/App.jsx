import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = axios.get("http://user-service:8081/me", { headers: { Authorization: `Bearer ${token}` } })
      const accessToken = res.data.access_token;
      localStorage.setItem('token', accessToken);
      setToken(accessToken);
      setError('');
    } catch (err) {
      setError('Credenciales inválidas');
    }
  };

  const fetchUserInfo = async () => {
    try {
      const res = await axios.get('http://localhost:8081/me', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserInfo(res.data);
    } catch (err) {
      setError('Token inválido o expirado');
      localStorage.removeItem('token');
      setToken('');
    }
  };

  useEffect(() => {
    if (token) fetchUserInfo();
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUserInfo(null);
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      <div>
        {!token ? (
          <>
            <h1>Iniciar Sesión</h1>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                name="email"
                placeholder="Correo"
                onChange={handleChange}
                required
              /><br />
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                onChange={handleChange}
                required
              /><br />
              <button type="submit">Entrar</button>
            </form>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        ) : (
          <>
            <h2>Sesión activa</h2>
            {userInfo ? (
              <div>
                <p><strong>ID:</strong> {userInfo.user_id}</p>
                <p><strong>Rol:</strong> {userInfo.role}</p>
              </div>
            ) : <p>Cargando información...</p>}
            <button onClick={handleLogout}>Cerrar sesión</button>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
