import pool from "../config/db.js";

// Get dashboard summary for the logged-in user
export const getDashboardSummary = async (user_id) => {
    const result = await pool.query(
        `
        SELECT
            (SELECT COUNT(*)
             FROM projects
             WHERE user_id = $1) AS total_projects,

            (SELECT COUNT(*)
             FROM projects
             WHERE user_id = $1
             AND status = 'IN_PROGRESS') AS active_projects,

            (SELECT COUNT(*)
             FROM members
             WHERE user_id = $1
             AND status = 'ACTIVE') AS active_members,

            (SELECT COUNT(*)
             FROM attendance
             WHERE user_id = $1
             AND attendance_date = CURRENT_DATE
             AND status = 'PRESENT') AS today_present,

            (SELECT COUNT(*)
             FROM attendance
             WHERE user_id = $1
             AND attendance_date = CURRENT_DATE
             AND status = 'ABSENT') AS today_absent,

            (SELECT COALESCE(SUM(amount), 0)
             FROM expenses
             WHERE user_id = $1) AS total_expenses,

            (SELECT COALESCE(SUM(total_salary), 0)
             FROM payroll
             WHERE user_id = $1
             AND payment_status = 'PAID') AS total_paid_payroll,

            (SELECT COUNT(*)
             FROM materials
             WHERE user_id = $1) AS total_materials,

            (SELECT COUNT(*)
             FROM site_reports
             WHERE user_id = $1) AS total_site_reports,

            (SELECT COUNT(*)
             FROM boq
             WHERE user_id = $1) AS total_project_items
        `,
        [user_id]
    );

    return result.rows[0];
};