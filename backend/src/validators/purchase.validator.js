import Joi from "joi";

export const createPurchaseSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .allow(null),

    supplier_id: Joi.number()
        .integer()
        .positive()
        .required(),

    material_id: Joi.number()
        .integer()
        .positive()
        .required(),

    invoice_number: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    purchase_date: Joi.date()
        .iso()
        .default(() => new Date()),

    quantity: Joi.number()
        .positive()
        .required(),

    unit: Joi.string()
        .trim()
        .max(30)
        .required(),

    rate: Joi.number()
        .min(0)
        .required(),

    paid_amount: Joi.number()
        .min(0)
        .default(0),

    notes: Joi.string()
        .trim()
        .max(1000)
        .allow("", null)
});

export const updatePurchaseSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .allow(null),

    supplier_id: Joi.number()
        .integer()
        .positive(),

    material_id: Joi.number()
        .integer()
        .positive(),

    invoice_number: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    purchase_date: Joi.date()
        .iso(),

    quantity: Joi.number()
        .positive(),

    unit: Joi.string()
        .trim()
        .max(30),

    rate: Joi.number()
        .min(0),

    paid_amount: Joi.number()
        .min(0),

    notes: Joi.string()
        .trim()
        .max(1000)
        .allow("", null)
}).min(1);