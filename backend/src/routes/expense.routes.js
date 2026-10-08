import express from "express";

import {
    createExpense,
    getExpenses,
    getExpense,
    updateExpense,
    deleteExpense
} from "../controllers/expense.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all expense APIs
router.use(authMiddleware);

// Create expense
router.post("/", createExpense);

// Get expenses for a project
router.get("/", getExpenses);

// Get expense by ID
router.get("/:id", getExpense);

// Update expense
router.patch("/:id", updateExpense);

// Delete expense
router.delete("/:id", deleteExpense);

export default router;