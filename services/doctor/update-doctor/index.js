// services/doctor/update-doctor/index.js
import express   from 'express';
import cors      from 'cors';
import dotenv    from 'dotenv';
import { sequelize, Doctor, UsersDoctors } from './models/index.js';

dotenv.config();
const app = express();

// Configuración completa de CORS (incluye preflight y headers personalizados)
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE','OPTIONS'],
  allowedHeaders: ['Authorization','Content-Type','X-Role']
}));
app.options('*', cors());

app.use(express.json());

// health-check
app.get('/health', (_req, res) => res.send('ok'));

app.put('/api/doctor/:cedula', async (req, res) => {
  const oldCedula = req.params.cedula;
  const allowed = [
    'cedula','name','email','phone_mobile','hospital_name',
    'hospital_address','department','shift_type',
    'years_experience','license_number','specialty','phone_off'
  ];

  const updates = {};
  for (const key of allowed) {
    if (key in req.body) updates[key] = req.body[key];
  }
  if (!Object.keys(updates).length)
    return res.status(400).json({ error: 'No valid fields to update' });

  const t = await sequelize.transaction();
  try {
    const doctor = await Doctor.findOne({ where: { cedula: oldCedula }, transaction: t });
    if (!doctor) {
      await t.rollback();
      return res.status(404).json({ error: 'Doctor not found' });
    }

    await doctor.update(updates, { transaction: t });

    // Si cambia cedula o nombre, actualizamos la réplica
    const replicaUpdates = {};
    if (updates.cedula) replicaUpdates.cedula = updates.cedula;
    if (updates.name)   replicaUpdates.name   = updates.name;

    if (Object.keys(replicaUpdates).length) {
      await UsersDoctors.update(
        replicaUpdates,
        { where: { cedula: oldCedula }, transaction: t }
      );
    }

    await t.commit();
    return res.json({ message: 'Doctor updated' });
  } catch (error) {
    await t.rollback();
    return res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 8009;
(async () => {
  try {
    await sequelize.authenticate();
    // Esto va a sincronizar BOTH tables: doctors + users_doctors
    await sequelize.sync();
    console.log('Database & replica table synchronized');

    app.listen(PORT, () => console.log(`update-doctor on ${PORT}`));
  } catch (e) {
    console.error('DB connection error:', e);
    process.exit(1);
  }
})();
