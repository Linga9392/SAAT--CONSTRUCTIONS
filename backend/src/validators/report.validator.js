import Joi from "joi";

// Validation for project report
export const projectReportSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});

// Validation for monthly expense report
export const monthlyExpenseReportSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    start_date: Joi.date()
        .iso()
        .required(),

    end_date: Joi.date()
        .iso()
        .min(Joi.ref("start_date"))
        .required()
});