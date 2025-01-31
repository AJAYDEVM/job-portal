import codes from "./httpStatusCode.js";

export const successResponse = (
  res,
  message,
  data,
  error = false,
  responseCode = codes.OK
) => {
  res.status(responseCode).json({ message, data, error });
};

export const errorResponse = (
  res,
  message,
  error = true,
  responseCode = codes.BadRequest
) => {
  res.status(responseCode).json({ message, data: [], error });
};