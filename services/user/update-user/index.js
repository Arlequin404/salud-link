const express = require('express');
const { Pool } = require('pg');
const { Kafka } = require('kafkajs');
const app = express();

app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'update-user-db',
  user: process.env.POSTGRES_USER || 'admin',
  password: process.env.POSTGRES_PASSWORD || 'admin123',
  database: process.env.POSTGRES_DB || 'update_user_db',
  port: 5432,
});

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'update-user-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

// Crear extensión uuid y tabla si no existen
async function createTable() {
  const client = await pool.connect();
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        cedula VARCHAR(20) UNIQUE NOT NULL,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20),
        birthdate DATE,
        gender VARCHAR(1),
        city VARCHAR(100),
        address VARCHAR(255),
        role VARCHAR(50)
      );
    `);
    console.log('✅ Tabla users verificada/creada');
  } catch (err) {
    console.error('❌ Error creando tabla:', err.message);
  } finally {
    client.release();
  }
}

// Conectar productor y crear tabla al iniciar
(async () => {
  try {
    await pool.connect();
    await createTable();
    await producer.connect();
    console.log('✅ Kafka producer connected');
  } catch (err) {
    console.error('❌ Error al iniciar servicio:', err.message);
  }
})();

// Endpoints

app.get('/', (_, res) => res.json({ status: "update-user service running" }));

app.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    if (result.rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuario', error: err.message });
  }
});

app.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const {
    cedula, name, email, password,
    phone, birthdate, gender, city, address, role
  } = req.body;

  try {
    const result = await pool.query(
      `UPDATE users SET
        cedula = $1, name = $2, email = $3, password = $4,
        phone = $5, birthdate = $6, gender = $7, city = $8,
        address = $9, role = $10 WHERE id = $11 RETURNING *`,
      [cedula, name, email, password, phone, birthdate, gender, city, address, role, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

    await producer.send({
      topic: 'user.updated',
      messages: [{ key: id, value: JSON.stringify(result.rows[0]) }]
    });

    res.json({ message: 'Usuario actualizado', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al actualizar usuario', error: err.message });
  }
});

app.post('/users', async (req, res) => {
  const {
    id, cedula, name, email, password,
    phone, birthdate, gender, city, address, role
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users (
        id, cedula, name, email, password, phone, birthdate,
        gender, city, address, role
      ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [id, cedula, name, email, password, phone, birthdate, gender, city, address, role]
    );
    res.json({ message: 'Usuario creado', user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: 'Error al crear usuario', error: err.message });
  }
});

// ✅ ENDPOINT FALTANTE PARA LISTAR TODOS LOS USUARIOS
app.get('/users', async (_, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener usuarios', error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 update-user service on port ${PORT}`));
