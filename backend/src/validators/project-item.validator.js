import Joi from "joi";

// Validation for creating a project item
export const createProjectItemSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    item_name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    description: Joi.string()
        .trim()
        .allow("", null),

    unit: Joi.string()
        .trim()
        .max(50)
        .required(),

    quantity: Joi.number()
        .positive()
        .precision(2)
        .required(),

    unit_price: Joi.number()
        .min(0)
        .precision(2)
        .required()
});

// Validation for updating a project item
export const updateProjectItemSchema = Joi.object({
    item_name: Joi.string()
        .trim()
        .min(2)
        .max(150),

    description: Joi.string()
        .trim()
        .allow("", null),

    unit: Joi.string()
        .trim()
        .max(50),

    quantity: Joi.number()
        .positive()
        .precision(2),

    unit_price: Joi.number()
        .min(0)
        .precision(2)
})
.min(1);

// Validation for project-based item list
export const projectItemProjectSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});