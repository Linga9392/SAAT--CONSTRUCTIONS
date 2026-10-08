import Joi from "joi";

// Validation for creating an expense
export const createExpenseSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    expense_date: Joi.date()
        .iso()
        .required(),

    category: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    description: Joi.string()
        .trim()
        .allow("", null),

    amount: Joi.number()
        .positive()
        .precision(2)
        .required(),

    payment_method: Joi.string()
        .valid(
            "CASH",
            "BANK_TRANSFER",
            "UPI",
            "CHEQUE",
            "CARD",
            "OTHER"
        )
        .default("CASH"),

    vendor_name: Joi.string()
        .trim()
        .max(150)
        .allow("", null),

    reference_number: Joi.string()
        .trim()
        .max(100)
        .allow("", null)
});

// Validation for updating an expense
export const updateExpenseSchema = Joi.object({
    expense_date: Joi.date()
        .iso(),

    category: Joi.string()
        .trim()
        .min(2)
        .max(100),

    description: Joi.string()
        .trim()
        .allow("", null),

    amount: Joi.number()
        .positive()
        .precision(2),

    payment_method: Joi.string()
        .valid(
            "CASH",
            "BANK_TRANSFER",
            "UPI",
            "CHEQUE",
            "CARD",
            "OTHER"
        ),

    vendor_name: Joi.string()
        .trim()
        .max(150)
        .allow("", null),

    reference_number: Joi.string()
        .trim()
        .max(100)
        .allow("", null)
})
.min(1);

// Validation for project-based expense list
export const expenseProjectSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});