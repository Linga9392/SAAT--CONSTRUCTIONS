import Joi from "joi";

// Validation for uploading a document
export const createDocumentSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required(),

    document_type: Joi.string()
        .valid(
            "PLAN",
            "PERMIT",
            "CONTRACT",
            "INVOICE",
            "RECEIPT",
            "PHOTO",
            "REPORT",
            "OTHER"
        )
        .default("OTHER"),

    description: Joi.string()
        .trim()
        .max(500)
        .allow("", null)
});

// Validation for project-based document list
export const documentProjectSchema = Joi.object({
    project_id: Joi.number()
        .integer()
        .positive()
        .required()
});