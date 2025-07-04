import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, Doctor } from './models/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8007;

// CORS para tu frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());

// Health-check
app.get('/health', (_req, res) => res.send('ok'));

// Listar todos los doctores
app.get('/api/doctors', async (_req, res) => {
  try {
    const doctors = await Doctor.findAll();
    res.json(doctors);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to doctor_db');
    // sincroniza el modelo con la tabla (crea columnas si hac falta)
    await sequelize.sync();
    console.log('Doctors table synchronized');
    app.listen(PORT, () => console.log(`list-doctors on ${PORT}`));
  } catch (e) {
    console.error('DB connection error:', e);
    process.exit(1);
  }
})();
