// services/doctor/update-doctor/models/doctor.js
import { DataTypes, Model } from 'sequelize';

export default class Doctor extends Model {
  static initModel(sequelize) {
    return super.init({
      doctor_id:        { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      cedula:           { type: DataTypes.STRING(20), allowNull: false, unique: true },
      name:             { type: DataTypes.STRING(255), allowNull: true },
      email:            { type: DataTypes.STRING(120), allowNull: true, validate: { isEmail: true } },
      phone_mobile:     { type: DataTypes.STRING(20), allowNull: true },
      hospital_name:    { type: DataTypes.STRING(120), allowNull: true },
      hospital_address: { type: DataTypes.STRING(160), allowNull: true },
      department:       { type: DataTypes.STRING(80), allowNull: true },
      shift_type:       { type: DataTypes.STRING(40), allowNull: true },
      years_experience: { type: DataTypes.SMALLINT, allowNull: true, defaultValue: 0 },
      license_number:   { type: DataTypes.STRING(25), allowNull: true, unique: true },
      specialty:        { type: DataTypes.STRING(255), allowNull: true, defaultValue: '' },
      phone_off:        { type: DataTypes.STRING(20), allowNull: true },
    }, {
      sequelize,
      tableName: 'doctors',
      underscored: true,
      timestamps: true
    });
  }
}
