import Joi from "joi";

export const createProjectSchema = Joi.object({
    project_name: Joi.string()
        .trim()
        .min(2)
        .max(150)
        .required(),

    client_name: Joi.string()
        .trim()
        .max(150)
        .allow("", null),

    location: Joi.string()
        .trim()
        .max(255)
        .allow("", null),

    description: Joi.string()
        .trim()
        .allow("", null),

    start_date: Joi.date()
        .iso()
        .allow(null),

    end_date: Joi.date()
        .iso()
        .min(Joi.ref("start_date"))
        .allow(null),

    budget: Joi.number()
        .precision(2)
        .min(0)
        .allow(null),

    status: Joi.string()
        .valid(
            "PLANNED",
            "IN_PROGRESS",
            "COMPLETED",
            "ON_HOLD",
            "CANCELLED"
        )
        .default("PLANNED")
});

export const updateProjectSchema = Joi.object({
    project_name: Joi.string()
        .trim()
        .min(2)
        .max(150),

    client_name: Joi.string()
        .trim()
        .max(150)
        .allow("", null),

    location: Joi.string()
        .trim()
        .max(255)
        .allow("", null),

    description: Joi.string()
        .trim()
        .allow("", null),

    start_date: Joi.date()
        .iso()
        .allow(null),

    end_date: Joi.date()
        .iso()
        .allow(null),

    budget: Joi.number()
        .precision(2)
        .min(0)
        .allow(null),

    status: Joi.string()
        .valid(
            "PLANNED",
            "IN_PROGRESS",
            "COMPLETED",
            "ON_HOLD",
            "CANCELLED"
        )
})
.min(1);