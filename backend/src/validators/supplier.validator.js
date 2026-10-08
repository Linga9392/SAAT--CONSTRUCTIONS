import Joi from "joi";

export const createSupplierSchema =
    Joi.object({
        supplier_name: Joi.string()
            .trim()
            .min(2)
            .max(150)
            .required(),

        company_name: Joi.string()
            .trim()
            .max(150)
            .allow("", null),

        phone: Joi.string()
            .trim()
            .max(20)
            .allow("", null),

        email: Joi.string()
            .trim()
            .email()
            .max(150)
            .allow("", null),

        address: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),

        gst_number: Joi.string()
            .trim()
            .max(30)
            .allow("", null),

        material_types: Joi.string()
            .trim()
            .max(1000)
            .allow("", null),

        status: Joi.string()
            .valid(
                "ACTIVE",
                "INACTIVE"
            )
            .default("ACTIVE"),
    });

export const updateSupplierSchema =
    Joi.object({
        supplier_name: Joi.string()
            .trim()
            .min(2)
            .max(150),

        company_name: Joi.string()
            .trim()
            .max(150)
            .allow("", null),

        phone: Joi.string()
            .trim()
            .max(20)
            .allow("", null),

        email: Joi.string()
            .trim()
            .email()
            .max(150)
            .allow("", null),

        address: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),

        gst_number: Joi.string()
            .trim()
            .max(30)
            .allow("", null),

        material_types: Joi.string()
            .trim()
            .max(1000)
            .allow("", null),

        status: Joi.string()
            .valid(
                "ACTIVE",
                "INACTIVE"
            ),
    }).min(1);