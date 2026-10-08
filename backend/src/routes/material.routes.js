import express from "express";

import {
    createMaterial,
    getMaterials,
    getMaterial,
    updateMaterial,
    deleteMaterial
} from "../controllers/material.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all material APIs
router.use(authMiddleware);

// Create material
router.post("/", createMaterial);

// Get materials for a project
router.get("/", getMaterials);

// Get material by ID
router.get("/:id", getMaterial);

// Update material
router.patch("/:id", updateMaterial);

// Delete material
router.delete("/:id", deleteMaterial);

export default router;