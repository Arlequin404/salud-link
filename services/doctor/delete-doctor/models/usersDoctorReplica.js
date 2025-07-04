import { DataTypes } from 'sequelize';

export default (sequelize) =>
  sequelize.define(
    'users_doctors',
    {
      user_id: {
        type: DataTypes.UUID,
        primaryKey: true
      },
      cedula: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false
      }
    },
    {
      tableName: 'users_doctors',
      timestamps: false
    }
  );
