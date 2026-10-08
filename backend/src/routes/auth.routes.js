import express from "express";

import {
    register,
    login,
    me
} from "../controllers/auth.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Register a new user
router.post("/register", register);

// Login user and generate JWT token
router.post("/login", login);

// Get currently logged-in user
router.get("/me", authMiddleware, me);

export default router;

