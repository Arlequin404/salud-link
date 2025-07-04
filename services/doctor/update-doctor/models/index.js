// services/doctor/update-doctor/models/index.js
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import Doctor from './doctor.js';
import UsersDoctors from './usersDoctorReplica.js';

dotenv.config();

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB
} = process.env;

// Aquí ya especificamos el dialect
export const sequelize = new Sequelize(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  { dialect: 'postgres', logging: false }
);

// Inicializamos los modelos
Doctor.initModel(sequelize);
UsersDoctors.initModel(sequelize);

export { Doctor, UsersDoctors };
