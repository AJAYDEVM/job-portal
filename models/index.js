import sequelize from '../config/db.js';
import User from './user.js';
import UserCredentials from './user.credentials.js';
import Job from './job.js';
import JobPortal from './job.portals.js';
import JobDocument from './job.documents.js';

// Define associations
User.hasOne(UserCredentials, {
  foreignKey: 'user_id',
  as: 'credentials'
});

UserCredentials.belongsTo(User, {
  foreignKey: 'user_id',
  as: 'user'
});

Job.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });
Job.belongsTo(JobPortal, { foreignKey: 'portal_id', as: 'portal' });
Job.hasMany(JobDocument, { foreignKey: 'job_id' });

JobPortal.hasMany(JobDocument, { foreignKey: 'portal_id' });

JobDocument.belongsTo(Job, { foreignKey: 'job_id' });
JobDocument.belongsTo(JobPortal, { foreignKey: 'portal_id' });


// Initialize all models
const models = {
  User,
  UserCredentials,
  JobPortal,
  Job,
  JobDocument
};

// Test database connection and sync models
async function initDatabase() {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    
    await sequelize.sync({});
    console.log('Database synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    process.exit(1);
  }
}

export { sequelize, User, UserCredentials, JobPortal, Job, JobDocument, initDatabase };