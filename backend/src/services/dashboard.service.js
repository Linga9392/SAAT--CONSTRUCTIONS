import {
    getDashboardSummary
} from "../repositories/dashboard.repository.js";

// Get dashboard summary
export const getDashboardSummaryService = async (
    user_id
) => {
    return await getDashboardSummary(user_id);
};