import express from 'express';
import cors from 'cors';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { initDatabase } from './models/index.js';
import authRoutes from './modules/auth/auth.route.js';
import portalRouter from './modules/portals/portals.route.js';
import jobRouter from './modules/jobs/jobs.route.js';
import { authenticateJWT } from './middleware/authMiddleware.js';
import { generateAnalytics } from './utils/analytics.cron.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

initDatabase();

cron.schedule('* * * * *', generateAnalytics, { //'0 0 * * *'
  scheduled: true,
  timezone: 'UTC',
});


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/portal', authenticateJWT, portalRouter)
app.use('/api/jobs', authenticateJWT, jobRouter);

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
