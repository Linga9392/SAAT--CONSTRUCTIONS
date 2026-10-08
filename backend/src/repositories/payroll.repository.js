import pool from "../config/db.js";

// Create payroll record
export const createPayroll = async ({
    user_id,
    project_id,
    member_id,
    salary_month,
    total_days,
    present_days,
    half_days,
    absent_days,
    overtime_hours,
    total_salary,
    payment_status
}) => {
    const result = await pool.query(
        `
        INSERT INTO payroll (
            user_id,
            project_id,
            member_id,
            salary_month,
            total_days,
            present_days,
            half_days,
            absent_days,
            overtime_hours,
            total_salary,
            payment_status
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            member_id,
            salary_month,
            total_days,
            present_days,
            half_days,
            absent_days,
            overtime_hours,
            total_salary,
            payment_status
        ]
    );

    return result.rows[0];
};

// Get all payroll records for a project
export const getPayrollByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM payroll
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY salary_month DESC, id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

// Get payroll record by ID
export const getPayrollById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM payroll
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Update payroll payment status
export const updatePayrollPayment = async (
    id,
    user_id,
    payment_status,
    paid_at
) => {
    const result = await pool.query(
        `
        UPDATE payroll
        SET
            payment_status = $1,
            paid_at = $2,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $3
        AND user_id = $4
        RETURNING *
        `,
        [
            payment_status,
            paid_at,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

// Delete payroll record
export const deletePayroll = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM payroll
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createPayroll,
    getPayrollByProject,
    getPayrollById,
    updatePayrollPayment,
    deletePayroll
};