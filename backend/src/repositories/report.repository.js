import pool from "../config/db.js";

// Get project report summary
export const getProjectReport = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT
            p.id AS project_id,
            p.project_name,
            p.client_name,
            p.location,
            p.status,
            p.budget,

            (
                SELECT COUNT(*)
                FROM members m
                WHERE m.project_id = p.id
                AND m.user_id = $2
            ) AS total_members,

            (
                SELECT COUNT(*)
                FROM members m
                WHERE m.project_id = p.id
                AND m.user_id = $2
                AND m.status = 'ACTIVE'
            ) AS active_members,

            (
                SELECT COUNT(*)
                FROM attendance a
                WHERE a.project_id = p.id
                AND a.user_id = $2
            ) AS total_attendance,

            (
                SELECT COUNT(*)
                FROM attendance a
                WHERE a.project_id = p.id
                AND a.user_id = $2
                AND a.status = 'PRESENT'
            ) AS present_attendance,

            (
                SELECT COUNT(*)
                FROM attendance a
                WHERE a.project_id = p.id
                AND a.user_id = $2
                AND a.status = 'ABSENT'
            ) AS absent_attendance,

            (
                SELECT COALESCE(SUM(e.amount), 0)
                FROM expenses e
                WHERE e.project_id = p.id
                AND e.user_id = $2
            ) AS total_expenses,

            (
                SELECT COALESCE(SUM(pr.total_salary), 0)
                FROM payroll pr
                WHERE pr.project_id = p.id
                AND pr.user_id = $2
            ) AS total_payroll,

            (
                SELECT COALESCE(SUM(pr.total_salary), 0)
                FROM payroll pr
                WHERE pr.project_id = p.id
                AND pr.user_id = $2
                AND pr.payment_status = 'PAID'
            ) AS paid_payroll,

            (
                SELECT COALESCE(SUM(b.total_amount), 0)
                FROM boq b
                WHERE b.project_id = p.id
                AND b.user_id = $2
            ) AS total_boq_amount,

            (
                SELECT COUNT(*)
                FROM materials mt
                WHERE mt.project_id = p.id
                AND mt.user_id = $2
            ) AS total_materials,

            (
                SELECT COUNT(*)
                FROM site_reports sr
                WHERE sr.project_id = p.id
                AND sr.user_id = $2
            ) AS total_site_reports

        FROM projects p
        WHERE p.id = $1
        AND p.user_id = $2
        LIMIT 1
        `,
        [project_id, user_id]
    );

    return result.rows[0];
};

// Get monthly expense report
export const getMonthlyExpenseReport = async (
    project_id,
    user_id,
    start_date,
    end_date
) => {
    const result = await pool.query(
        `
        SELECT
            DATE_TRUNC('month', expense_date) AS month,
            COUNT(*) AS expense_count,
            COALESCE(SUM(amount), 0) AS total_amount
        FROM expenses
        WHERE project_id = $1
        AND user_id = $2
        AND expense_date >= $3
        AND expense_date <= $4
        GROUP BY DATE_TRUNC('month', expense_date)
        ORDER BY month ASC
        `,
        [
            project_id,
            user_id,
            start_date,
            end_date
        ]
    );

    return result.rows;
};