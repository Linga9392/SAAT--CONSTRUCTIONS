import Joi from "joi";

export const createSiteProgressSchema =
    Joi.object({
        project_id: Joi.number()
            .integer()
            .positive()
            .required(),

        progress_date: Joi.date()
            .iso()
            .default(() => new Date()),

        progress_percentage: Joi.number()
            .min(0)
            .max(100)
            .required(),

        work_completed: Joi.string()
            .trim()
            .min(2)
            .max(2000)
            .required(),

        work_in_progress: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),

        manpower_count: Joi.number()
            .integer()
            .min(0)
            .allow(null),

        material_status: Joi.string()
            .trim()
            .max(1000)
            .allow("", null),

        issues: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),

        remarks: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),
    });

export const updateSiteProgressSchema =
    Joi.object({
        project_id: Joi.number()
            .integer()
            .positive(),

        progress_date: Joi.date()
            .iso(),

        progress_percentage: Joi.number()
            .min(0)
            .max(100),

        work_completed: Joi.string()
            .trim()
            .min(2)
            .max(2000),

        work_in_progress: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),

        manpower_count: Joi.number()
            .integer()
            .min(0)
            .allow(null),

        material_status: Joi.string()
            .trim()
            .max(1000)
            .allow("", null),

        issues: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),

        remarks: Joi.string()
            .trim()
            .max(2000)
            .allow("", null),
    })
    .min(1);