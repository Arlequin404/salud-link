import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import DoctorModel from './doctor.js';

dotenv.config();

const {
  POSTGRES_HOST,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD
} = process.env;

// Aquí usamos la firma de Sequelize(db, user, pass, options)
export const sequelize = new Sequelize(
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    host: POSTGRES_HOST,
    dialect: 'postgres',
    // si no defines POSTGRES_PORT, usará el 5432 por defecto
    logging: false
  }
);

export const Doctor = DoctorModel(sequelize);
