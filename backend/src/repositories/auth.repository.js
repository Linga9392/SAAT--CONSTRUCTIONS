import pool from "../config/db.js";

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `
        SELECT
            id,
            full_name,
            email,
            password_hash,
            phone,
            role,
            status,
            created_at,
            updated_at
        FROM users
        WHERE email = $1
        LIMIT 1
        `,
        [email]
    );

    return result.rows[0];
};

export const findUserById = async (id) => {
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
        [id]
    );

    return result.rows[0];
};

export const createUser = async ({
    full_name,
    email,
    password_hash,
    phone,
    role = "USER"
}) => {
    const result = await pool.query(
        `
        INSERT INTO users (
            full_name,
            email,
            password_hash,
            phone,
            role
        )
        VALUES ($1, $2, $3, $4, $5)
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
        [full_name, email, password_hash, phone, role]
    );

    return result.rows[0];
};

export default {
    findUserByEmail,
    findUserById,
    createUser
};