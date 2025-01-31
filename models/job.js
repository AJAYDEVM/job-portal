import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Job = sequelize.define('Job', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      notEmpty: true
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  status: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: 'published', 
    validate: {
      isIn: [['draft', 'published', 'archived', 'inactive']] 
    }
  },
  created_by: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
      portal_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'job_portals',
        key: 'id'
      }
    },
}, {
  tableName: 'jobs',
  timestamps: true, 
  indexes: [
    {
      fields: ['created_by']
    },
    {
      fields: ['status'] 
    }
  ],
  hooks: {
    beforeCreate: (job) => {
      if (!job.status) {
        job.status = 'published';
      }
    }
  }
});

export default Job;