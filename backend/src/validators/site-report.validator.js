import Joi from "joi";

// Validation for creating a site report
export const createSiteReportSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    report_date: Joi.date()
        .iso()
        .required(),

    work_completed: Joi.string()
        .trim()
        .allow("", null),

    workers_count: Joi.number()
        .integer()
        .min(0)
        .default(0),

    materials_used: Joi.string()
        .trim()
        .allow("", null),

    issues: Joi.string()
        .trim()
        .allow("", null),

    safety_notes: Joi.string()
        .trim()
        .allow("", null),

    weather: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    supervisor_notes: Joi.string()
        .trim()
        .allow("", null)
});

// Validation for updating a site report
export const updateSiteReportSchema = Joi.object({
    report_date: Joi.date()
        .iso(),

    work_completed: Joi.string()
        .trim()
        .allow("", null),

    workers_count: Joi.number()
        .integer()
        .min(0),

    materials_used: Joi.string()
        .trim()
        .allow("", null),

    issues: Joi.string()
        .trim()
        .allow("", null),

    safety_notes: Joi.string()
        .trim()
        .allow("", null),

    weather: Joi.string()
        .trim()
        .max(100)
        .allow("", null),

    supervisor_notes: Joi.string()
        .trim()
        .allow("", null)
})
.min(1);

// Validation for project-based site reports
export const siteReportProjectSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});