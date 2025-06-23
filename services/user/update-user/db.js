// update-user/db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USER || "admin",
  host: process.env.DB_HOST || "update-user-db",
  database: process.env.POSTGRES_DB || "update_user_db",
  password: process.env.POSTGRES_PASSWORD || "admin123",
  port: 5432,
});

const initDB = async () => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
        cedula VARCHAR(20),
        name VARCHAR(100),
        email VARCHAR(100),
        phone VARCHAR(20),
        birthdate DATE,
        gender VARCHAR(10),
        city VARCHAR(50),
        address VARCHAR(100),
        role VARCHAR(20)
      );
    `);
    console.log("✅ Tabla 'users' verificada/creada.");
  } finally {
    client.release();
  }
};

module.exports = { pool, initDB };
