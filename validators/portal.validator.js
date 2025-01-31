import Joi from 'joi';

export const createPortalSchema = Joi.object({
    name: Joi.string()
        .min(2)
        .max(100)
        .required()
        .trim()
        .messages({
            'string.empty': 'Portal name is required',
            'string.min': 'Portal name must be at least 2 characters long',
            'string.max': 'Portal name must not exceed 100 characters',
            'any.required': 'Portal name is required'
        }),
    
    description: Joi.string()
        .max(1000)
        .allow('')
        .required()
        .trim()
        .messages({
            'string.max': 'Description must not exceed 1000 characters'
        }),
    
    status: Joi.string()
        .valid('active', 'inactive', 'maintenance')
        .default('active')
        .messages({
            'any.only': 'Status must be either active, inactive, or maintenance'
        })
});