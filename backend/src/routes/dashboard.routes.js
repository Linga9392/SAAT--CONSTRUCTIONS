import express from "express";

import {
    getDashboardSummary
} from "../controllers/dashboard.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to dashboard APIs
router.use(authMiddleware);

// Get dashboard summary
router.get("/summary", getDashboardSummary);

export default router;