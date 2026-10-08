import pool from "../config/db.js";

// Create a new expense
export const createExpense = async ({
    user_id,
    project_id,
    expense_date,
    category,
    description,
    amount,
    payment_method,
    vendor_name,
    reference_number
}) => {
    const result = await pool.query(
        `
        INSERT INTO expenses (
            user_id,
            project_id,
            expense_date,
            category,
            description,
            amount,
            payment_method,
            vendor_name,
            reference_number
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            expense_date,
            category,
            description,
            amount,
            payment_method,
            vendor_name,
            reference_number
        ]
    );

    return result.rows[0];
};

// Get all expenses for a project
export const getExpensesByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM expenses
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY expense_date DESC, id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

// Get expense by ID
export const getExpenseById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM expenses
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Update expense
export const updateExpense = async (
    id,
    user_id,
    {
        expense_date,
        category,
        description,
        amount,
        payment_method,
        vendor_name,
        reference_number
    }
) => {
    const result = await pool.query(
        `
        UPDATE expenses
        SET
            expense_date = $1,
            category = $2,
            description = $3,
            amount = $4,
            payment_method = $5,
            vendor_name = $6,
            reference_number = $7,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $8
        AND user_id = $9
        RETURNING *
        `,
        [
            expense_date,
            category,
            description,
            amount,
            payment_method,
            vendor_name,
            reference_number,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

// Delete expense
export const deleteExpense = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM expenses
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createExpense,
    getExpensesByProject,
    getExpenseById,
    updateExpense,
    deleteExpense
};