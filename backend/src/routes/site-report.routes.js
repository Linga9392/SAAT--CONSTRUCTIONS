import express from "express";

import {
    createSiteReport,
    getSiteReports,
    getSiteReport,
    updateSiteReport,
    deleteSiteReport
} from "../controllers/site-report.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all site report APIs
router.use(authMiddleware);

// Create site report
router.post("/", createSiteReport);

// Get site reports for a project
router.get("/", getSiteReports);

// Get site report by ID
router.get("/:id", getSiteReport);

// Update site report
router.patch("/:id", updateSiteReport);

// Delete site report
router.delete("/:id", deleteSiteReport);

export default router;