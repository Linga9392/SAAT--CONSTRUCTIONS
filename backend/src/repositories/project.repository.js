import pool from "../config/db.js";

export const createProject = async ({
    user_id,
    project_name,
    client_name,
    location,
    description,
    start_date,
    end_date,
    budget,
    status
}) => {
    const result = await pool.query(
        `
        INSERT INTO projects (
            user_id,
            project_name,
            client_name,
            location,
            description,
            start_date,
            end_date,
            budget,
            status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
            user_id,
            project_name,
            client_name,
            location,
            description,
            start_date,
            end_date,
            budget,
            status
        ]
    );

    return result.rows[0];
};

export const getProjectsByUser = async (user_id) => {
    const result = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE user_id = $1
        ORDER BY id DESC
        `,
        [user_id]
    );

    return result.rows;
};

export const getProjectById = async (id, user_id) => {
    const result = await pool.query(
        `
        SELECT *
        FROM projects
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export const updateProject = async (
    id,
    user_id,
    {
        project_name,
        client_name,
        location,
        description,
        start_date,
        end_date,
        budget,
        status
    }
) => {
    const result = await pool.query(
        `
        UPDATE projects
        SET
            project_name = $1,
            client_name = $2,
            location = $3,
            description = $4,
            start_date = $5,
            end_date = $6,
            budget = $7,
            status = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        AND user_id = $10
        RETURNING *
        `,
        [
            project_name,
            client_name,
            location,
            description,
            start_date,
            end_date,
            budget,
            status,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

export const deleteProject = async (id, user_id) => {
    const result = await pool.query(
        `
        DELETE FROM projects
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};