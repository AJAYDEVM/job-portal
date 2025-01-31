import { JobPortal } from '../../models/index.js';
import sequelize from '../../config/db.js';
import codes from '../../utils/httpStatusCode.js';
import { responseMessage } from '../../utils/message.js';
import Job from '../../models/job.js';

export const saveJob = async (jobData) => {

  try {

    const isPortalExist = await JobPortal.findOne({ 
        where: {id: jobData?.portal_id }
    });

    if(!isPortalExist) { // chekcing portal id is valid
        throw { 
            status: codes.BadRequest, 
            message: responseMessage.INVALID_JOB_ID 
        };
    }

    const job = await Job.create({
        title: jobData?.title,
        description: jobData?.description,
        portal_id: jobData?.portal_id,
        created_by: jobData?.user_id
    })
    const rawJob = job.get({ plain: true });    
    return rawJob;
  } catch (error) {
    console.log('error', error);
    throw error;
  }
};

export const getSavedJobs = async () => {
    try {
      const jobs = await Job.findAll({
          where: {status: 'published' },
          raw: true
      });
      return jobs;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
};

export const updatedSavedJobs = async (jobData) => {
    try {
      const job = await Job.findOne({
          where: {id: jobData?.id, status: 'published', created_by: jobData?.user_id },
          raw: true
      });

      if(!job) {
        throw { 
            status: codes.BadRequest, 
            message: responseMessage.INVALID_JOB_ID 
        };
      }

      const [updatedRows] = await Job.update(
        { 
            title: jobData?.title,
            description: jobData?.description
        },
        {
            where: { id: jobData?.id },
            returning: true,
        }
    );

    if (updatedRows === 0) {
        throw {
            status: codes.InternalServerError,
            message: responseMessage.INTERNAL_SERVER_ERROR
        };
    }
      return jobData?.id;
    } catch (error) {
      console.log('error', error);
      throw error;
    }
};

export const deleteSavedJob = async (id, user_id) => { 
    try {
        const isexist = await Job.findOne({
            where: { id , status: 'published', created_by: user_id},
            attributes: ['id', 'title', 'description'],
            raw: true
        })
        
        if(!isexist) {
            throw { 
                status: codes.BadRequest, 
                message: responseMessage.INVALID_PORTAL_ID 
            };
        }
        const [updatedRows] = await Job.update(
            { status: 'inactive' },
            {
                where: { id },
                returning: true,
            }
        );
        
        if (updatedRows === 0) {
            throw {
                status: codes.InternalServerError,
                message: responseMessage.INTERNAL_SERVER_ERROR
            };
        }
        
        return isexist;
    } catch (error) {
        throw error;
    }
};