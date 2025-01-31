import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const UserCredentials = sequelize.define('UserCredentials', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
}, {
  tableName: 'user_credentials',
  timestamps: true
});

export default UserCredentials;