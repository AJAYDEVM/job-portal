import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const JobDocument = sequelize.define('JobDocument', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    job_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'jobs',
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
    file_name: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    file_type: {
      type: DataTypes.ENUM('pdf', 'doc', 'docx'),
      allowNull: false
    },
    file_size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        max: 5 * 1024 * 1024 // 5MB in bytes
      }
    },
    file_url: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    extracted_text: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'job_documents',
    timestamps: true,
    indexes: [
      {
        fields: ['job_id']
      },
      {
        fields: ['portal_id']
      },
      {
        unique: true,
        fields: ['job_id', 'portal_id']
      }
    ]
  });

export default JobDocument;