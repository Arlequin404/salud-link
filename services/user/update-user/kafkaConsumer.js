const { Kafka } = require('kafkajs');
const { Pool } = require('pg');

// Configuración de PostgreSQL
const pool = new Pool({
  host: 'update-user-db',
  user: 'admin',
  password: 'admin123',
  database: 'update_user_db',
  port: 5432,
});

// Configuración de Kafka
const kafka = new Kafka({
  clientId: 'update-user-sync',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({ groupId: 'update-user-group' });

// Crear extensión y tabla si no existen
async function createTable() {
  const client = await pool.connect();
  try {
    await client.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY,
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
    console.log('✅ Tabla users verificada/creada en consumer');
  } catch (err) {
    console.error('❌ Error creando tabla en consumer:', err.message);
  } finally {
    client.release();
  }
}

async function startConsumer() {
  await createTable();
  await consumer.connect();
  await consumer.subscribe({ topic: 'user.updated', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const user = JSON.parse(message.value.toString());
      const {
        id, cedula, name, email, password,
        phone, birthdate, gender, city, address, role
      } = user;

      try {
        const existing = await pool.query('SELECT id FROM users WHERE id = $1', [id]);

        if (existing.rowCount > 0) {
          await pool.query(
            `UPDATE users SET
              cedula = $1, name = $2, email = $3, password = $4,
              phone = $5, birthdate = $6, gender = $7, city = $8,
              address = $9, role = $10
            WHERE id = $11`,
            [cedula, name, email, password, phone, birthdate, gender, city, address, role, id]
          );
          console.log(`✅ Usuario actualizado [ID: ${id}]`);
        } else {
          await pool.query(
            `INSERT INTO users (id, cedula, name, email, password, phone, birthdate, gender, city, address, role)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
            [id, cedula, name, email, password, phone, birthdate, gender, city, address, role]
          );
          console.log(`🆕 Usuario insertado [ID: ${id}]`);
        }
      } catch (err) {
        console.error('❌ Error procesando mensaje Kafka:', err.message);
      }
    },
  });
}

startConsumer().catch(console.error);
