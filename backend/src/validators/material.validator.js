import Joi from "joi";

// Validation for creating a material
export const createMaterialSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    material_name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    category: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    unit: Joi.string()
        .trim()
        .max(50)
        .required(),

    quantity: Joi.number()
        .min(0)
        .precision(2)
        .required(),

    purchase_price: Joi.number()
        .min(0)
        .precision(2)
        .allow(null),

    supplier_name: Joi.string()
        .trim()
        .max(150)
        .allow("", null),

    minimum_stock: Joi.number()
        .min(0)
        .precision(2)
        .default(0)
});

// Validation for updating a material
export const updateMaterialSchema = Joi.object({
    material_name: Joi.string()
        .trim()
        .min(2)
        .max(150),

    category: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    unit: Joi.string()
        .trim()
        .max(50),

    quantity: Joi.number()
        .min(0)
        .precision(2),

    purchase_price: Joi.number()
        .min(0)
        .precision(2)
        .allow(null),

    supplier_name: Joi.string()
        .trim()
        .max(150)
        .allow("", null),

    minimum_stock: Joi.number()
        .min(0)
        .precision(2)
})
.min(1);

// Validation for project-based material list
export const materialProjectSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});