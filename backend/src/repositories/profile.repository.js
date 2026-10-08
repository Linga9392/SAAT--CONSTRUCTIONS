import pool from "../config/db.js";

// Get user profile
export const getProfile = async (user_id) => {
    const result = await pool.query(
        `
        SELECT
            id,
            full_name,
            email,
            phone,
            role,
            status,
            created_at,
            updated_at
        FROM users
        WHERE id = $1
        LIMIT 1
        `,
        [user_id]
    );

    return result.rows[0];
};

// Update user profile
export const updateProfile = async (
    user_id,
    {
        full_name,
        phone
    }
) => {
    const result = await pool.query(
        `
        UPDATE users
        SET
            full_name = COALESCE($1, full_name),
            phone = COALESCE($2, phone),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        RETURNING
            id,
            full_name,
            email,
            phone,
            role,
            status,
            created_at,
            updated_at
        `,
        [
            full_name ?? null,
            phone ?? null,
            user_id
        ]
    );

    return result.rows[0];
};

export default {
    getProfile,
    updateProfile
};