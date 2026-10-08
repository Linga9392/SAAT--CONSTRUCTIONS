import pool from "../config/db.js";

// Create a new material
export const createMaterial = async ({
    user_id,
    project_id,
    material_name,
    category,
    unit,
    quantity,
    purchase_price,
    supplier_name,
    minimum_stock
}) => {
    const result = await pool.query(
        `
        INSERT INTO materials (
            user_id,
            project_id,
            material_name,
            category,
            unit,
            quantity,
            purchase_price,
            supplier_name,
            minimum_stock
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            material_name,
            category,
            unit,
            quantity,
            purchase_price,
            supplier_name,
            minimum_stock
        ]
    );

    return result.rows[0];
};

// Get all materials for a project
export const getMaterialsByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM materials
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

// Get material by ID
export const getMaterialById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM materials
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Update material
export const updateMaterial = async (
    id,
    user_id,
    {
        material_name,
        category,
        unit,
        quantity,
        purchase_price,
        supplier_name,
        minimum_stock
    }
) => {
    const result = await pool.query(
        `
        UPDATE materials
        SET
            material_name = $1,
            category = $2,
            unit = $3,
            quantity = $4,
            purchase_price = $5,
            supplier_name = $6,
            minimum_stock = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        AND user_id = $9
        RETURNING *
        `,
        [
            material_name,
            category,
            unit,
            quantity,
            purchase_price,
            supplier_name,
            minimum_stock,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

// Delete material
export const deleteMaterial = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM materials
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createMaterial,
    getMaterialsByProject,
    getMaterialById,
    updateMaterial,
    deleteMaterial
};