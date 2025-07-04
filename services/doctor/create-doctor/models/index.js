import sequelize from '../config/database.js';
import defineDoctor from './doctor.js';

const Doctor = defineDoctor(sequelize);

export { sequelize, Doctor };
