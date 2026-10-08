import pool from "../config/db.js";

// Create a new member
export const createMember = async ({
    user_id,
    project_id,
    full_name,
    phone,
    role,
    joining_date,
    daily_wage,
    status
}) => {
    const result = await pool.query(
        `
        INSERT INTO members (
            user_id,
            project_id,
            full_name,
            phone,
            role,
            joining_date,
            daily_wage,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            full_name,
            phone,
            role,
            joining_date,
            daily_wage,
            status
        ]
    );

    return result.rows[0];
};

// Get all members for a project
export const getMembersByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM members
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

// Get one member
export const getMemberById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM members
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Update member
export const updateMember = async (
    id,
    user_id,
    {
        full_name,
        phone,
        role,
        joining_date,
        daily_wage,
        status
    }
) => {
    const result = await pool.query(
        `
        UPDATE members
        SET
            full_name = $1,
            phone = $2,
            role = $3,
            joining_date = $4,
            daily_wage = $5,
            status = $6,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $7
        AND user_id = $8
        RETURNING *
        `,
        [
            full_name,
            phone,
            role,
            joining_date,
            daily_wage,
            status,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

// Delete member
export const deleteMember = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM members
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createMember,
    getMembersByProject,
    getMemberById,
    updateMember,
    deleteMember
};

