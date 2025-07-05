import { DataTypes } from 'sequelize';
import sequelize from '../utils/db.js';

export const DoctorSchedule = sequelize.define('DoctorSchedule', {
  schedule_id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  doctor_cedula: { type: DataTypes.STRING, allowNull: false },
  day_of_week: { type: DataTypes.INTEGER, allowNull: false },
  start_time: { type: DataTypes.TIME, allowNull: false },
  end_time: { type: DataTypes.TIME, allowNull: false }
  // ⛔ slot_duration_minutes eliminado para evitar el error
}, {
  tableName: 'doctor_schedules',
  timestamps: false
});
