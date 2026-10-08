import express from "express";

import {
    getProjectReport,
    getMonthlyExpenseReport
} from "../controllers/report.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all report APIs
router.use(authMiddleware);

// Get complete project report
router.get("/project", getProjectReport);

// Get monthly expense report
router.get("/monthly-expenses", getMonthlyExpenseReport);

export default router;