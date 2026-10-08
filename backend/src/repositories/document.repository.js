import pool from "../config/db.js";

// Create a new document
export const createDocument = async ({
    user_id,
    project_id,
    file_name,
    file_path,
    file_type,
    file_size,
    document_type,
    description
}) => {
    const result = await pool.query(
        `
        INSERT INTO documents (
            user_id,
            project_id,
            file_name,
            file_path,
            file_type,
            file_size,
            document_type,
            description
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            file_name,
            file_path,
            file_type,
            file_size,
            document_type,
            description
        ]
    );

    return result.rows[0];
};

// Get all documents for a project
export const getDocumentsByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM documents
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

// Get document by ID
export const getDocumentById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM documents
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Delete document
export const deleteDocument = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM documents
        WHERE id = $1
        AND user_id = $2
        RETURNING id, file_path
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createDocument,
    getDocumentsByProject,
    getDocumentById,
    deleteDocument
};