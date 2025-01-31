import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const JobPortal = sequelize.define('JobPortal', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING(255),
    allowNull: false,
    defaultValue: 'active',
    validate: {
      isIn: [['active', 'inactive']] 
    }
  },
  logo_url: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  logo_file_name: {
    type: DataTypes.STRING(255),
    allowNull: true
  },
  logo_file_size: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      max: 2 * 1024 * 1024 // 2MB in bytes
    }
  }
}, {
  tableName: 'job_portals',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['name']
    }
  ]
});

export default JobPortal;