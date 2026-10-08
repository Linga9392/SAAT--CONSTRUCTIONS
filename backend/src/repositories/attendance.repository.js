import pool from "../config/db.js";

export const createAttendance = async ({
    user_id,
    project_id,
    member_id,
    attendance_date,
    status,
    overtime_hours,
    wage_amount
}) => {
    const result = await pool.query(
        `
        INSERT INTO attendance (
            user_id,
            project_id,
            member_id,
            attendance_date,
            status,
            overtime_hours,
            wage_amount
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            member_id,
            attendance_date,
            status,
            overtime_hours,
            wage_amount
        ]
    );

    return result.rows[0];
};

export const getAttendanceByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM attendance
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY attendance_date DESC, id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

export const getAttendanceById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM attendance
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export const updateAttendance = async (
    id,
    user_id,
    {
        attendance_date,
        status,
        overtime_hours,
        wage_amount
    }
) => {
    const result = await pool.query(
        `
        UPDATE attendance
        SET
            attendance_date = $1,
            status = $2,
            overtime_hours = $3,
            wage_amount = $4,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $5
        AND user_id = $6
        RETURNING *
        `,
        [
            attendance_date,
            status,
            overtime_hours,
            wage_amount,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

export const deleteAttendance = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM attendance
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createAttendance,
    getAttendanceByProject,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
};