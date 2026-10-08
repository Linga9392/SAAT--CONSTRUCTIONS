import {
    createSiteReport,
    getSiteReportsByProject,
    getSiteReportById,
    updateSiteReport,
    deleteSiteReport
} from "../repositories/site-report.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Create site report
export const createSiteReportService = async (
    data,
    user_id
) => {
    // Verify project ownership
    const project = await getProjectById(
        data.project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await createSiteReport({
        ...data,
        user_id
    });
};

// Get site reports by project
export const getSiteReportsService = async (
    project_id,
    user_id
) => {
    // Verify project ownership
    const project = await getProjectById(
        project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await getSiteReportsByProject(
        project_id,
        user_id
    );
};

// Get site report by ID
export const getSiteReportService = async (
    id,
    user_id
) => {
    const report = await getSiteReportById(
        id,
        user_id
    );

    if (!report) {
        const error = new Error("Site report not found");
        error.statusCode = 404;
        throw error;
    }

    return report;
};

// Update site report
export const updateSiteReportService = async (
    id,
    user_id,
    data
) => {
    // Get existing report first
    const existingReport = await getSiteReportById(
        id,
        user_id
    );

    if (!existingReport) {
        const error = new Error("Site report not found");
        error.statusCode = 404;
        throw error;
    }

    // Keep existing values for fields not provided
    const updatedData = {
        report_date:
            data.report_date ??
            existingReport.report_date,

        work_completed:
            data.work_completed ??
            existingReport.work_completed,

        workers_count:
            data.workers_count ??
            existingReport.workers_count,

        materials_used:
            data.materials_used ??
            existingReport.materials_used,

        issues:
            data.issues ??
            existingReport.issues,

        safety_notes:
            data.safety_notes ??
            existingReport.safety_notes,

        weather:
            data.weather ??
            existingReport.weather,

        supervisor_notes:
            data.supervisor_notes ??
            existingReport.supervisor_notes
    };

    return await updateSiteReport(
        id,
        user_id,
        updatedData
    );
};

// Delete site report
export const deleteSiteReportService = async (
    id,
    user_id
) => {
    const report = await deleteSiteReport(
        id,
        user_id
    );

    if (!report) {
        const error = new Error("Site report not found");
        error.statusCode = 404;
        throw error;
    }

    return report;
};