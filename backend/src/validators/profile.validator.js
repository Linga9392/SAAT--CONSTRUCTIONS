import Joi from "joi";

// Validation for updating user profile
export const updateProfileSchema = Joi.object({
    full_name: Joi.string()
        .trim()
        .min(2)
        .max(100),

    phone: Joi.string()
        .trim()
        .pattern(/^[0-9]{10}$/)
        .allow("", null)
})
.min(1);