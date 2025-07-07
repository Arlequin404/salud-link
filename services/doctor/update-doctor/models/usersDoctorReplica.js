// services/doctor/update-doctor/models/usersDoctorReplica.js
import { DataTypes, Model } from 'sequelize';

export default class UsersDoctors extends Model {
  static initModel(sequelize) {
    return super.init({
      user_id: { type: DataTypes.UUID, primaryKey: true },
      cedula:  { type: DataTypes.STRING(20), allowNull: false, unique: true },
      name:    { type: DataTypes.STRING(255), allowNull: false },
    }, {
      sequelize,
      tableName: 'users_doctors',
      timestamps: false
    });
  }
}
