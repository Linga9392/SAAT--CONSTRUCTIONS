import {
    getDashboardSummaryService
} from "../services/dashboard.service.js";

// Get dashboard summary
export const getDashboardSummary = async (req, res) => {
    const summary = await getDashboardSummaryService(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: summary
    });
};