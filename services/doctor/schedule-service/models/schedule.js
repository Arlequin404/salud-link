// models/schedule.js
import { DataTypes, Model } from 'sequelize';

export default class DoctorSchedule extends Model {
  static initModel(sequelize) {
    return super.init({
      schedule_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      doctor_cedula: {
        type: DataTypes.STRING(20),
        allowNull: false
      },
      day_of_week: {
        type: DataTypes.SMALLINT,
        allowNull: false
      },
      start_time: {
        type: DataTypes.TIME,
        allowNull: false
      },
      end_time: {
        type: DataTypes.TIME,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'doctor_schedules',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    });
  }
}
