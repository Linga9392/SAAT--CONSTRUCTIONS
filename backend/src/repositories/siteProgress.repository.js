import pool from "../config/db.js";

export const checkUserProject = async (
    userId,
    projectId
) => {
    const result = await pool.query(
        `
        SELECT id
        FROM projects
        WHERE
            id = $1
            AND user_id = $2
        LIMIT 1
        `,
        [
            projectId,
            userId,
        ]
    );

    return result.rows[0];
};

export const createSiteProgress = async (
    userId,
    data
) => {
    const result = await pool.query(
        `
        INSERT INTO site_progress (
            user_id,
            project_id,
            progress_date,
            progress_percentage,
            work_completed,
            work_in_progress,
            manpower_count,
            material_status,
            issues,
            remarks
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10
        )
        RETURNING *
        `,
        [
            userId,
            data.project_id,
            data.progress_date,
            data.progress_percentage,
            data.work_completed,
            data.work_in_progress,
            data.manpower_count,
            data.material_status,
            data.issues,
            data.remarks,
        ]
    );

    return result.rows[0];
};

export const getSiteProgress = async (
    userId
) => {
    const result = await pool.query(
        `
        SELECT
            sp.*,
            p.project_name
        FROM site_progress sp

        INNER JOIN projects p
            ON sp.project_id = p.id

        WHERE
            sp.user_id = $1

        ORDER BY
            sp.progress_date DESC,
            sp.id DESC
        `,
        [userId]
    );

    return result.rows;
};

export const getSiteProgressById = async (
    userId,
    progressId
) => {
    const result = await pool.query(
        `
        SELECT
            sp.*,
            p.project_name
        FROM site_progress sp

        INNER JOIN projects p
            ON sp.project_id = p.id

        WHERE
            sp.id = $1
            AND sp.user_id = $2

        LIMIT 1
        `,
        [
            progressId,
            userId,
        ]
    );

    return result.rows[0];
};

export const updateSiteProgress = async (
    userId,
    progressId,
    data
) => {
    const result = await pool.query(
        `
        UPDATE site_progress

        SET
            project_id = $1,
            progress_date = $2,
            progress_percentage = $3,
            work_completed = $4,
            work_in_progress = $5,
            manpower_count = $6,
            material_status = $7,
            issues = $8,
            remarks = $9,
            updated_at = CURRENT_TIMESTAMP

        WHERE
            id = $10
            AND user_id = $11

        RETURNING *
        `,
        [
            data.project_id,
            data.progress_date,
            data.progress_percentage,
            data.work_completed,
            data.work_in_progress,
            data.manpower_count,
            data.material_status,
            data.issues,
            data.remarks,
            progressId,
            userId,
        ]
    );

    return result.rows[0];
};

export const deleteSiteProgress = async (
    userId,
    progressId
) => {
    const result = await pool.query(
        `
        DELETE FROM site_progress

        WHERE
            id = $1
            AND user_id = $2

        RETURNING id
        `,
        [
            progressId,
            userId,
        ]
    );

    return result.rows[0];
};

export const getProjectProgressSummary = async (
    userId,
    projectId
) => {
    const result = await pool.query(
        `
        SELECT
            sp.id,
            sp.project_id,
            p.project_name,
            sp.progress_date,
            sp.progress_percentage,
            sp.work_completed,
            sp.work_in_progress,
            sp.manpower_count,
            sp.material_status,
            sp.issues,
            sp.remarks
        FROM site_progress sp

        INNER JOIN projects p
            ON sp.project_id = p.id

        WHERE
            sp.user_id = $1
            AND sp.project_id = $2

        ORDER BY
            sp.progress_date DESC,
            sp.id DESC
        `,
        [
            userId,
            projectId,
        ]
    );

    return result.rows;
};

export default {
    checkUserProject,
    createSiteProgress,
    getSiteProgress,
    getSiteProgressById,
    updateSiteProgress,
    deleteSiteProgress,
    getProjectProgressSummary,
};