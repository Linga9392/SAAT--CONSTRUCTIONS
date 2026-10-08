import pool from "../config/db.js";

// Create a new site report
export const createSiteReport = async ({
    user_id,
    project_id,
    report_date,
    work_completed,
    workers_count,
    materials_used,
    issues,
    safety_notes,
    weather,
    supervisor_notes
}) => {
    const result = await pool.query(
        `
        INSERT INTO site_reports (
            user_id,
            project_id,
            report_date,
            work_completed,
            workers_count,
            materials_used,
            issues,
            safety_notes,
            weather,
            supervisor_notes
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            report_date,
            work_completed,
            workers_count,
            materials_used,
            issues,
            safety_notes,
            weather,
            supervisor_notes
        ]
    );

    return result.rows[0];
};

// Get all site reports for a project
export const getSiteReportsByProject = async (
    project_id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM site_reports
        WHERE project_id = $1
        AND user_id = $2
        ORDER BY report_date DESC, id DESC
        `,
        [project_id, user_id]
    );

    return result.rows;
};

// Get site report by ID
export const getSiteReportById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM site_reports
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Update site report
export const updateSiteReport = async (
    id,
    user_id,
    {
        report_date,
        work_completed,
        workers_count,
        materials_used,
        issues,
        safety_notes,
        weather,
        supervisor_notes
    }
) => {
    const result = await pool.query(
        `
        UPDATE site_reports
        SET
            report_date = $1,
            work_completed = $2,
            workers_count = $3,
            materials_used = $4,
            issues = $5,
            safety_notes = $6,
            weather = $7,
            supervisor_notes = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $9
        AND user_id = $10
        RETURNING *
        `,
        [
            report_date,
            work_completed,
            workers_count,
            materials_used,
            issues,
            safety_notes,
            weather,
            supervisor_notes,
            id,
            user_id
        ]
    );

    return result.rows[0];
};

// Delete site report
export const deleteSiteReport = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM site_reports
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createSiteReport,
    getSiteReportsByProject,
    getSiteReportById,
    updateSiteReport,
    deleteSiteReport
};