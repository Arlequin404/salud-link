import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models/index.js';
import doctorRoutes from './routes/doctorRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8006;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// monta las rutas bajo /api/doctor
app.use('/api/doctor', doctorRoutes);

// health check
app.get('/health', (_req, res) => res.send('ok'));

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to doctor_db');
    await sequelize.sync();
    console.log('Tabla doctors sincronizada');
    app.listen(PORT, () => {
      console.log(`create-doctor running on :${PORT}`);
    });
  } catch (e) {
    console.error('DB error:', e);
    process.exit(1);
  }
})();
