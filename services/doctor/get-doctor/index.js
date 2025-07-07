import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, Doctor } from './models/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8008;

// 1) Habilita CORS para tu frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// health-check
app.get('/health', (_req, res) => res.send('ok'));

// Obtener doctor por cédula
app.get('/api/doctor/:cedula', async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ where: { cedula: req.params.cedula } });
    if (!doctor) return res.status(404).json({ error: 'Doctor not found' });
    res.json(doctor);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to doctor_db');
    // Si necesitas sincronizar cambios en el modelo, descomenta:
    // await sequelize.sync();
    app.listen(PORT, () => console.log(`get-doctor on ${PORT}`));
  } catch (e) {
    console.error('DB connection error:', e);
    process.exit(1);
  }
})();
