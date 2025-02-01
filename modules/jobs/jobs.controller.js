import { errorResponse, successResponse } from '../../utils/response.js';
import { responseMessage } from '../../utils/message.js';
import codes from '../../utils/httpStatusCode.js';
import { deleteSavedJob, getSavedJobs, saveJob, updatedSavedJobs, uploadJobDocumentService } from './jobs.service.js';
import { createJobSchema, updateJobSchema } from '../../validators/job.validator.js';
import Joi from 'joi';


export const createJob = async (req, res) => {
    try {
        const { error, value } = createJobSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        
        if (error) {
            const validationErrors = error.details.map(detail => detail.message);
            return errorResponse(res, validationErrors[0], true, codes.BadRequest);
        }

        const jobData = {
            ...value,
            user_id:  req.user?.id,
        }
        
        console.log('req.user', req.user);        
        const job = await saveJob(jobData)
        return successResponse(res, responseMessage.JOB_CREATED, job);
    }   catch (error) {
        console.error('Create job error:', error);
        const statusCode = error.status || codes.InternalServerError;
        return errorResponse(
            res,
            error.message || responseMessage.INTERNAL_SERVER_ERROR,
            true,
            statusCode
        );
    }
  };

  export const getJobs = async (req, res) => {
    try {        
        const jobs = await getSavedJobs()
        return successResponse(res, responseMessage.JOB_FETCHED, jobs);
    }   catch (error) {
        console.error('fetchj job error:', error);
        const statusCode = error.status || codes.InternalServerError;
        return errorResponse(
            res,
            error.message || responseMessage.INTERNAL_SERVER_ERROR,
            true,
            statusCode
        );
    }
  };


  export const updateJob = async (req, res) => {
    try {        

        const { error, value } = updateJobSchema.validate(req.body, {
            abortEarly: false,
            stripUnknown: true,
        });
        
        if (error) {
            const validationErrors = error.details.map(detail => detail.message);
            return errorResponse(res, validationErrors[0], true, codes.BadRequest);
        }

        const id = req.params?.id;
        if(!id) {
            return errorResponse(
                res,
                responseMessage.INVALID_JOB_ID,
                codes.BadRequest
            );
        }

        const jobData = {
            ...value,
            user_id:  req.user?.id,
            id: req.params.id
        }

        const jobs = await updatedSavedJobs(jobData)
        return successResponse(res, responseMessage.JOB_UPDATED, jobs);
    }   catch (error) {
        console.error('update job error:', error);
        const statusCode = error.status || codes.InternalServerError;
        return errorResponse(
            res,
            error.message || responseMessage.INTERNAL_SERVER_ERROR,
            statusCode
        );
    }
  };


export const deleteJob = async (req, res) => {
    try {
      const { id } = req.params;
      const user_id = req.user?.id;
      const job = await deleteSavedJob(id, user_id);      
      return successResponse(res, responseMessage.JOB_DELETED, job);
    } catch (error) {
      console.error('delete portal error:', error);
      const statusCode = error.status || codes.InternalServerError;
      return errorResponse(
        res,
        error.message || responseMessage.INTERNAL_SERVER_ERROR,
        statusCode
      );
    }
  }; 

  export const uploadJobDocument = async (req, res) => {
    try {
        // Validate request parameters
        console.log('req.dole', req.file);
        
        const paramsSchema = Joi.object({
            id: Joi.string().uuid().required(),
            portalId: Joi.string().uuid().required()
        });

        const { error: paramsError } = paramsSchema.validate(req.params);
        if (paramsError) {
            return errorResponse(res, 'Invalid job or portal ID', true, codes.BadRequest);
        }

        const reqData = {
            jobId: req.params.id,
            portalId: req.params.portalId,
            document: req.file,
            userId: req.user.id 
        }

        console.log('reqdata', reqData);
        // return
        // Upload and process document
        const result = await uploadJobDocumentService(reqData);

        return successResponse(res, 'Document uploaded successfully', result);
    } catch (error) {
        console.error('Job document upload error:', error);
        const statusCode = error.status || codes.InternalServerError;
        return errorResponse(
            res, 
            error.message || responseMessage.INTERNAL_SERVER_ERROR, 
            true, 
            statusCode
        );
    }
};