import pool from "../config/db.js";

// Create a new project item
export const createProjectItem = async ({
    user_id,
    project_id,
    item_name,
    description,
    unit,
    quantity,
    unit_price
}) => {
    const result = await pool.query(
        `
        INSERT INTO boq (
            user_id,
            project_id,
            item_name,
            description,
            unit,
            quantity,
            unit_price
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            item_name,
            description,
            unit,
            quantity,
            unit_price
        ]
    );

    return result.rows[0];
};

// Get all project items for a project
export const getProjectItemsByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM boq
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

// Get project item by ID
export const getProjectItemById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM boq
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Update project item
export const updateProjectItem = async (
    id,
    user_id,
    {
        item_name,
        description,
        unit,
        quantity,
        unit_price
    }
) => {
    const result = await pool.query(
        `
        UPDATE boq
        SET
            item_name = $1,
            description = $2,
            unit = $3,
            quantity = $4,
            unit_price = $5,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $6
        AND user_id = $7
        RETURNING *
        `,
        [
            item_name,
            description,
            unit,
            quantity,
            unit_price,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

// Delete project item
export const deleteProjectItem = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM boq
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createProjectItem,
    getProjectItemsByProject,
    getProjectItemById,
    updateProjectItem,
    deleteProjectItem
};