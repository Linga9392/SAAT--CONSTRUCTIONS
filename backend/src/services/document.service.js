import {
    createDocument,
    getDocumentsByProject,
    getDocumentById,
    deleteDocument
} from "../repositories/document.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Create document
export const createDocumentService = async (
    data,
    user_id
) => {
    // Verify that the project belongs to the logged-in user
    const project = await getProjectById(
        data.project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await createDocument({
        ...data,
        user_id
    });
};

// Get all documents for a project
export const getDocumentsService = async (
    project_id,
    user_id
) => {
    // Verify project ownership
    const project = await getProjectById(
        project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await getDocumentsByProject(
        project_id,
        user_id
    );
};

// Get document by ID
export const getDocumentService = async (
    id,
    user_id
) => {
    const document = await getDocumentById(
        id,
        user_id
    );

    if (!document) {
        const error = new Error("Document not found");
        error.statusCode = 404;
        throw error;
    }

    return document;
};

// Delete document
export const deleteDocumentService = async (
    id,
    user_id
) => {
    const document = await deleteDocument(
        id,
        user_id
    );

    if (!document) {
        const error = new Error("Document not found");
        error.statusCode = 404;
        throw error;
    }

    return document;
};