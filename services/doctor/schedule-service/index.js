// index.js (schedule-service)
import express from 'express';
import cors from 'cors';                      // ← IMPORTA CORS
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import scheduleRoutes from './routes/scheduleRoutes.js';
import Doctor from './models/doctor.js';
import DoctorSchedule from './models/schedule.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8012;

// ─────────────── INICIALIZA LA CONEXIÓN ───────────────
const sequelize = new Sequelize(
  process.env.POSTGRES_DB,       // doctor_db
  process.env.POSTGRES_USER,     // admin
  process.env.POSTGRES_PASSWORD, // admin123
  {
    host: process.env.POSTGRES_HOST, // postgres-doctor
    dialect: 'postgres',
    logging: false
  }
);

// ─────────────── MODELOS & ASOCIACIONES ───────────────
Doctor.initModel(sequelize);
DoctorSchedule.initModel(sequelize);

Doctor.hasMany(DoctorSchedule, {
  foreignKey: 'doctor_cedula',
  sourceKey: 'cedula'
});
DoctorSchedule.belongsTo(Doctor, {
  foreignKey: 'doctor_cedula',
  targetKey: 'cedula'
});

// ─────────────── MIDDLEWARE & RUTAS ───────────────
app.use(cors({                              // ← HABILITA CORS
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());


// health-check
app.get('/health', (_req, res) => res.send('ok'));

// todas las rutas de schedule
app.use(
  '/api/doctors/:doctorCedula/schedule',
  scheduleRoutes
);

// ─────────────── ARRANCA EL SERVIDOR ───────────────
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to doctor_db');
    await sequelize.sync();
    console.log('Database synchronized');
    app.listen(PORT, () => {
      console.log(`schedule-service running on :${PORT}`);
    });
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
})();
