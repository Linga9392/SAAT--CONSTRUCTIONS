import express from "express";

import {
    createProject,
    getProjects,
    getProject,
    updateProject,
    deleteProject
} from "../controllers/project.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createProject);

router.get("/", getProjects);

router.get("/:id", getProject);

router.patch("/:id", updateProject);

router.delete("/:id", deleteProject);

export default router;

