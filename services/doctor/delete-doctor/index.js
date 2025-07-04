import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize, Doctor, UsersDoctors } from './models/index.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8010;

// CORS para tu frontend
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// health-check
app.get('/health', (_req, res) => res.send('ok'));

// DELETE /api/doctor/:cedula
app.delete('/api/doctor/:cedula', async (req, res) => {
  const { cedula } = req.params;
  const t = await sequelize.transaction();
  try {
    const doctor = await Doctor.findOne({ where: { cedula }, transaction: t });
    if (!doctor) {
      await t.rollback();
      return res.status(404).json({ error: 'Doctor not found' });
    }

    // Borra primero en tabla principal y luego en la réplica
    await Doctor.destroy({ where: { cedula }, transaction: t });
    await UsersDoctors.destroy({ where: { cedula }, transaction: t });

    await t.commit();
    res.json({ message: 'Doctor deleted' });
  } catch (error) {
    await t.rollback();
    res.status(500).json({ error: error.message });
  }
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to doctor_db');
    // Si quieres sincronizar estructuras:
    // await sequelize.sync();
    app.listen(PORT, () => console.log(`delete-doctor on ${PORT}`));
  } catch (e) {
    console.error('DB connection error:', e);
    process.exit(1);
  }
})();
