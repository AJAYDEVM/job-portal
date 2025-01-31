import { errorResponse, successResponse } from '../../utils/response.js';
import { responseMessage } from '../../utils/message.js';
import codes from '../../utils/httpStatusCode.js';
import { createJobPortal, deleteJobPortal, getJobPortal, updateJobPortal } from './portals.service.js';
import { createPortalSchema } from '../../validators/portal.validator.js';



export const createPortals = async (req, res) => {
    try {
      const data = { ...req.body };
      const { error, value } = createPortalSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });
  
      if (error) {
        const validationErrors = error.details.map(detail => detail.message);
        return errorResponse(res, validationErrors[0], true, codes.BadRequest);
      }

  
      const portalData = {
        ...value,
        logoData: req.file,
      };
  
      const portal = await createJobPortal(portalData);
      console.log('portal', portal);
      
      return successResponse(res, responseMessage.PORTAL_CREATED, portal);
    } catch (error) {
      console.error('Create portal error:', error);
      const statusCode = error.status || codes.InternalServerError;
      return errorResponse(
        res,
        error.message || responseMessage.INTERNAL_SERVER_ERROR,
        true,
        statusCode
      );
    }
  };;

  export const getPortals = async (req, res) => {
    try {
      const portal = await getJobPortal();
      console.log('portalsssssss', portal);
      
      return successResponse(res, responseMessage.PORTAL_FETCHED, portal);
    } catch (error) {
      console.error('Create portal error:', error);
      return errorResponse(
        res,
        responseMessage.INTERNAL_SERVER_ERROR,
        codes.InternalServerError
      );
    }
  };

  export const deletePortal = async (req, res) => {
    try {
      const { id } = req.params;
      const portal = await deleteJobPortal(id);      
      return successResponse(res, responseMessage.PORTAL_DELETED, portal);
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

  export const updatePortal = async (req, res) => {
    try {
      const { id } = req.params;
      const data = { ...req.body };
      const { error, value } = createPortalSchema.validate(data, {
        abortEarly: false,
        stripUnknown: true,
      });

      if (error) {
        const validationErrors = error.details.map(detail => detail.message);
        return errorResponse(res, validationErrors[0], true, codes.BadRequest);
      }

      const portalData = {
        ...value,
        logoData: req.file,
      };

      const portal = await updateJobPortal(id, portalData);      
      return successResponse(res, responseMessage.PORTAL_UPDATED, portal);
    } catch (error) {
      console.error('update portal error:', error);
      const statusCode = error.status || codes.InternalServerError;
      return errorResponse(
        res,
        error.message || responseMessage.INTERNAL_SERVER_ERROR,
        statusCode
      );
    }
  };