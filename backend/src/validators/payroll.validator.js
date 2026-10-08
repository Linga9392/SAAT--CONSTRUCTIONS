import Joi from "joi";

// Validation for creating payroll
export const createPayrollSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    member_id: Joi.number()
        .integer()
        .positive()
        .required(),

    salary_month: Joi.date()
        .iso()
        .required(),

    total_days: Joi.number()
        .integer()
        .min(0)
        .required(),

    present_days: Joi.number()
        .integer()
        .min(0)
        .required(),

    half_days: Joi.number()
        .integer()
        .min(0)
        .required(),

    absent_days: Joi.number()
        .integer()
        .min(0)
        .required(),

    overtime_hours: Joi.number()
        .min(0)
        .precision(2)
        .default(0),

    total_salary: Joi.number()
        .min(0)
        .precision(2)
        .required(),

    payment_status: Joi.string()
        .valid(
            "PENDING",
            "PAID"
        )
        .default("PENDING")
});

// Validation for getting payroll by project
export const payrollProjectSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});

// Validation for updating payroll payment
export const updatePayrollPaymentSchema = Joi.object({
    payment_status: Joi.string()
        .valid(
            "PENDING",
            "PAID"
        )
        .required(),

    paid_at: Joi.date()
        .iso()
        .allow(null)
});