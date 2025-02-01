import { JobPortal, JobDocument } from '../../models/index.js';
import sequelize from '../../config/db.js';
import codes from '../../utils/httpStatusCode.js';
import { responseMessage } from '../../utils/message.js';
import Job from '../../models/job.js';
import { uploadDocToS3 } from '../../utils/s3upload.js';
import { extractFormattedText } from '../../utils/processDoc.js';

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

export const uploadJobDocumentService = async (uploadData) => {
    const { jobId, portalId, document, userId } = uploadData;
    const transaction = await sequelize.transaction();

    try {
        const job = await Job.findOne({
            where: { id: jobId, created_by: userId },
            transaction
        });

        if (!job) {
            throw { 
                status: codes.NotFound, 
                message: responseMessage.JOB_NOT_FOUND 
            };
        }
        console.log('1.......');

        const portal = await JobPortal.findByPk(portalId, { transaction });
        if (!portal) {
            throw { 
                status: codes.NotFound, 
                message: responseMessage.PORTAL_NOT_FOUND
            };
        }

        const existingDocument = await JobDocument.findOne({
            where: { job_id: jobId, portal_id: portalId },
            transaction
        });

        if (existingDocument) {
            throw { 
                status: codes.Conflict, 
                message: responseMessage.DOC_EXIST
            };
        }

        // Upload file to S3
        const { docUrl } = await uploadDocToS3(uploadData.document, portalId, jobId);
        console.log('fileUrl', docUrl);
        
        // Extract formatted text
        const formattedText = await extractFormattedText(uploadData.document);
        console.log('formattedText', formattedText);
        // return null;
        // Create job document record
        const jobDocument = await JobDocument.create({
            job_id: jobId,
            portal_id: portalId,
            file_name: document.originalname,
            file_url: docUrl,
            file_type: document.mimetype.split('/').pop(),
            file_size: document.size,
            extracted_text: formattedText
        }, { transaction });

        await transaction.commit();
        return jobDocument;
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};