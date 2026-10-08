import express from "express";

import {
    createProjectItem,
    getProjectItems,
    getProjectItem,
    updateProjectItem,
    deleteProjectItem
} from "../controllers/project-item.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all project item APIs
router.use(authMiddleware);

// Create project item
router.post("/", createProjectItem);

// Get project items for a project
router.get("/", getProjectItems);

// Get project item by ID
router.get("/:id", getProjectItem);

// Update project item
router.patch("/:id", updateProjectItem);

// Delete project item
router.delete("/:id", deleteProjectItem);

export default router;