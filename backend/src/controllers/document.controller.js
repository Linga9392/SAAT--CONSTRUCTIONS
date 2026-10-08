import fs from "fs";
import path from "path";

import {
    createDocumentService,
    getDocumentsService,
    getDocumentService,
    deleteDocumentService
} from "../services/document.service.js";

import {
    createDocumentSchema,
    documentProjectSchema
} from "../validators/document.validator.js";

// Upload a document
export const uploadDocument = async (req, res) => {
    const { error, value } = createDocumentSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    // Check whether a file was uploaded
    if (!req.file) {
        const error = new Error("Document file is required");
        error.statusCode = 400;
        throw error;
    }

    const document = await createDocumentService(
        {
            project_id: value.project_id,
            file_name: req.file.originalname,
            file_path: req.file.path,
            file_type: req.file.mimetype,
            file_size: req.file.size,
            document_type: value.document_type,
            description: value.description
        },
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: document
    });
};

// Get all documents for a project
export const getDocuments = async (req, res) => {
    const { error, value } = documentProjectSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const documents = await getDocumentsService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: documents
    });
};

// Get document by ID
export const getDocument = async (req, res) => {
    const document = await getDocumentService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: document
    });
};

// Download document
export const downloadDocument = async (req, res) => {
    const document = await getDocumentService(
        req.params.id,
        req.user.id
    );

    const filePath = path.resolve(
        document.file_path
    );

    if (!fs.existsSync(filePath)) {
        const error = new Error("Document file not found");
        error.statusCode = 404;
        throw error;
    }

    res.download(
        filePath,
        document.file_name
    );
};

// Delete document
export const deleteDocument = async (req, res) => {
    const document = await deleteDocumentService(
        req.params.id,
        req.user.id
    );

    const filePath = path.resolve(
        document.file_path
    );

    // Delete physical file if it exists
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }

    res.status(200).json({
        success: true,
        message: "Document deleted successfully",
        data: document
    });
};