import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import DoctorModel from './doctor.js';
import UsersDoctorReplicaModel from './usersDoctorReplica.js';

dotenv.config();

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_DB
} = process.env;

export const sequelize = new Sequelize(
  `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOST}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  { logging: false }
);

export const Doctor = DoctorModel(sequelize);
export const UsersDoctors = UsersDoctorReplicaModel(sequelize);
