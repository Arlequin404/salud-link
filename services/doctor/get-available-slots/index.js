import express from 'express';
import dotenv from 'dotenv';
import availableSlotsRoutes from './routes/availableSlotsRoutes.js';
import sequelize from './utils/db.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8013;

app.use(express.json());

// Ruta de prueba
app.get('/test', (req, res) => {
  console.log('✅ /test respondido');
  res.json({ status: 'ok' });
});

// Rutas reales del microservicio
app.use('/api/slots', availableSlotsRoutes);

// Captura rutas no encontradas
app.use((req, res) => {
  console.warn(`⚠️ Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Captura errores internos
app.use((err, req, res, next) => {
  console.error('💥 ERROR DETECTADO:', err.stack || err);
  res.status(500).json({ error: 'Unexpected error' });
});

// Captura errores globales
process.on('unhandledRejection', err => {
  console.error('❌ Unhandled Promise Rejection:', err);
});

process.on('uncaughtException', err => {
  console.error('❌ Uncaught Exception:', err);
});

// Verifica conexión a PostgreSQL y arranca el servidor
sequelize.authenticate()
  .then(() => {
    console.log('✅ Conexión exitosa a PostgreSQL doctor_db');
    app.listen(PORT, () => {
      console.log(`🚀 Microservicio get-available-slots escuchando en el puerto ${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err.message);
  });
