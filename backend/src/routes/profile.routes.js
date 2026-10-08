import express from "express";

import {
    getProfile,
    updateProfile
} from "../controllers/profile.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all profile APIs
router.use(authMiddleware);

// Get current user profile
router.get("/", getProfile);

// Update current user profile
router.patch("/", updateProfile);

export default router;