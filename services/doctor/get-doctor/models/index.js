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

export const sequelize = new Sequelize(
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  {
    host: POSTGRES_HOST,
    dialect: 'postgres',
    logging: false
  }
);

export const Doctor = DoctorModel(sequelize);
