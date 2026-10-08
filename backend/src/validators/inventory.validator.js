import Joi from "joi";

export const createInventorySchema =
    Joi.object({
        project_id: Joi.number()
            .integer()
            .positive()
            .allow(null),

        material_id: Joi.number()
            .integer()
            .positive()
            .required(),

        transaction_type: Joi.string()
            .valid(
                "STOCK_IN",
                "STOCK_OUT"
            )
            .required(),

        quantity: Joi.number()
            .positive()
            .required(),

        unit: Joi.string()
            .trim()
            .max(30)
            .required(),

        rate: Joi.number()
            .min(0)
            .default(0),

        reference_type: Joi.string()
            .trim()
            .max(50)
            .allow("", null),

        reference_id: Joi.number()
            .integer()
            .positive()
            .allow(null),

        notes: Joi.string()
            .trim()
            .max(1000)
            .allow("", null),

        transaction_date: Joi.date()
            .iso()
            .default(() => new Date()),
    });

export const updateInventorySchema =
    Joi.object({
        project_id: Joi.number()
            .integer()
            .positive()
            .allow(null),

        material_id: Joi.number()
            .integer()
            .positive(),

        transaction_type: Joi.string()
            .valid(
                "STOCK_IN",
                "STOCK_OUT"
            ),

        quantity: Joi.number()
            .positive(),

        unit: Joi.string()
            .trim()
            .max(30),

        rate: Joi.number()
            .min(0),

        reference_type: Joi.string()
            .trim()
            .max(50)
            .allow("", null),

        reference_id: Joi.number()
            .integer()
            .positive()
            .allow(null),

        notes: Joi.string()
            .trim()
            .max(1000)
            .allow("", null),

        transaction_date: Joi.date()
            .iso(),
    }).min(1);