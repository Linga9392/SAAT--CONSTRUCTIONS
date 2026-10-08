import {
    getProjectReportService,
    getMonthlyExpenseReportService
} from "../services/report.service.js";

import {
    projectReportSchema,
    monthlyExpenseReportSchema
} from "../validators/report.validator.js";

// Get complete project report
export const getProjectReport = async (req, res) => {
    const { error, value } = projectReportSchema.validate(
        req.query,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const report = await getProjectReportService(
        value.project_id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: report
    });
};

// Get monthly expense report
export const getMonthlyExpenseReport = async (req, res) => {
    const { error, value } =
        monthlyExpenseReportSchema.validate(
            req.query,
            {
                abortEarly: false,
                stripUnknown: true
            }
        );

    if (error) {
        throw error;
    }

    const report =
        await getMonthlyExpenseReportService(
            value.project_id,
            req.user.id,
            value.start_date,
            value.end_date
        );

    res.status(200).json({
        success: true,
        data: report
    });
};