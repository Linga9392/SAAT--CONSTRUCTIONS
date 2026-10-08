import Joi from "joi";

// Validation for creating a notification
export const createNotificationSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .allow(null),

    title: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    message: Joi.string()
        .trim()
        .min(1)
        .max(1000)
        .required(),

    type: Joi.string()
        .valid(
            "GENERAL",
            "PROJECT",
            "ATTENDANCE",
            "PAYROLL",
            "MATERIAL",
            "EXPENSE",
            "SITE_REPORT",
            "DOCUMENT"
        )
        .default("GENERAL")
});