import { DataTypes, Model } from 'sequelize';

export default class Doctor extends Model {
  static initModel(sequelize) {
    Doctor.init({
      cedula: {
        type: DataTypes.STRING(20),
        primaryKey: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      sequelize,
      tableName: 'doctors',
      timestamps: false
    });
    return Doctor;
  }
}
