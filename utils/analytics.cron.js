import { Job, sequelize } from '../models/index.js';
import { Op } from 'sequelize';

export const generateAnalytics = async () => {
  try {
    console.log('Generating job analytics report...');

    const portalStats = await Job.findAll({
      attributes: ['portal_id', [sequelize.fn('COUNT', sequelize.col('id')), 'job_count']],
      group: ['portal_id'],
      raw: true,
    });

    const jobTrends = await Promise.all([
      { timeframe: 'week', days: 7 },
      { timeframe: 'month', days: 30 },
      { timeframe: 'year', days: 365 }
    ].map(async ({ timeframe, days }) => {
      const count = await Job.count({
        where: {
          createdAt: {
            [Op.gte]: sequelize.literal(`DATEADD(DAY, -${days}, GETDATE())`)
          }
        }
      });
      return { timeframe, count };
    }));

    console.log('Portal Stats:', portalStats);
    console.log('Job Trends:', jobTrends);
    console.log('Analytics report generated successfully.');
  } catch (error) {
    console.error('Error generating analytics report:', error);
  }
};