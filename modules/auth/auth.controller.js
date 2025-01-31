import { errorResponse, successResponse } from '../../utils/response.js';
import { responseMessage } from '../../utils/message.js';
import codes from '../../utils/httpStatusCode.js';
import { registerUser, loginUser } from './auth.service.js';
import { registerSchema } from '../../validators/auth.validator.js';

export const login = async (req, res) => {
    try {
      const tokenData = await loginUser(req.body);
      successResponse(res, responseMessage.LOGIN_SUCCESS, tokenData);
    } catch (error) {
      console.error('Login error:', error);
      const statusCode = error.status || codes.InternalServerError;
      errorResponse(res, error.message || responseMessage.INTERNAL_SERVER_ERROR, true, statusCode);
    }
};

export const register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body, { abortEarly: false });
    if (error) {
      return errorResponse(res, error.details.map(err => err.message).join(', '), true, codes.BadRequest);
    }
    const response = await registerUser(req.body);
    successResponse(res, response, responseMessage.REGISTRATION_SUCCESS, codes.Created)
  } catch (error) {
    console.error('Registration error:', error);
    const statusCode = error.status || codes.InternalServerError;
    errorResponse(res, error.message || responseMessage.INTERNAL_SERVER_ERROR, true, statusCode);
  }
};
