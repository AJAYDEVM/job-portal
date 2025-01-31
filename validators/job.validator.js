import Joi from 'joi';

export const createJobSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim()
        .messages({
            'string.empty': 'Job title is required',
            'string.min': 'Job title must be at least 2 characters long',
            'string.max': 'Job title must not exceed 100 characters',
            'any.required': 'Job title is required'
        }),
    
    description: Joi.string()
        .max(1000)
        .allow('')
        .required()
        .trim()
        .messages({
            'string.max': 'Description must not exceed 1000 characters'
        }),

    portal_id: Joi.string()
        .guid({ version: 'uuidv4' })
        .required()
        .messages({
            'string.empty': 'Portal ID is required',
            'string.guid': 'Portal ID must be a valid UUID',
            'any.required': 'Portal ID is required'
        }),
});

export const updateJobSchema = Joi.object({
    title: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim()
        .messages({
            'string.empty': 'Job title is required',
            'string.min': 'Job title must be at least 2 characters long',
            'string.max': 'Job title must not exceed 100 characters',
            'any.required': 'Job title is required'
        }),
    
    description: Joi.string()
        .max(1000)
        .allow('')
        .required()
        .trim()
        .messages({
            'string.max': 'Description must not exceed 1000 characters'
        }),

});