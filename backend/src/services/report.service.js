import {
    getProjectReport,
    getMonthlyExpenseReport
} from "../repositories/report.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Get project report
export const getProjectReportService = async (
    project_id,
    user_id
) => {
    // Verify that the project belongs to the logged-in user
    const project = await getProjectById(
        project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await getProjectReport(
        project_id,
        user_id
    );
};

// Get monthly expense report
export const getMonthlyExpenseReportService = async (
    project_id,
    user_id,
    start_date,
    end_date
) => {
    // Verify that the project belongs to the logged-in user
    const project = await getProjectById(
        project_id,
        user_id
    );

    if (!project) {
        const error = new Error("Project not found");
        error.statusCode = 404;
        throw error;
    }

    return await getMonthlyExpenseReport(
        project_id,
        user_id,
        start_date,
        end_date
    );
};