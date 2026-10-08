import Joi from "joi";

export const registerSchema = Joi.object({
    full_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    email: Joi.string()
        .trim()
        .email()
        .required(),

    password: Joi.string()
        .min(6)
        .max(100)
        .required(),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .allow("", null)
});

export const loginSchema = Joi.object({
    email: Joi.string()
        .trim()
        .email()
        .required(),

    password: Joi.string()
        .required()
});