import Joi from "joi";

export const createMemberSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    full_name: Joi.string()
        .trim()
        .min(2)
        .max(100)
        .required(),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .allow("", null),

    role: Joi.string()
        .valid(
            "ENGINEER",
            "SUPERVISOR",
            "WORKER",
            "CONTRACTOR",
            "OTHER"
        )
        .default("OTHER"),

    joining_date: Joi.date()
        .iso()
        .allow(null),

    daily_wage: Joi.number()
        .precision(2)
        .min(0)
        .allow(null),

    status: Joi.string()
        .valid(
            "ACTIVE",
            "INACTIVE"
        )
        .default("ACTIVE")
});

export const updateMemberSchema = Joi.object({
    full_name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .allow("", null),

    role: Joi.string()
        .valid(
            "ENGINEER",
            "SUPERVISOR",
            "WORKER",
            "CONTRACTOR",
            "OTHER"
        ),

    joining_date: Joi.date()
        .iso()
        .allow(null),

    daily_wage: Joi.number()
        .precision(2)
        .min(0)
        .allow(null),

    status: Joi.string()
        .valid(
            "ACTIVE",
            "INACTIVE"
        )
})
.min(1);