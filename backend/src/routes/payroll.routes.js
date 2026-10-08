import express from "express";

import {
    createPayroll,
    getPayroll,
    getPayrollById,
    updatePayrollPayment,
    deletePayroll
} from "../controllers/payroll.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all payroll APIs
router.use(authMiddleware);

// Create payroll
router.post("/", createPayroll);

// Get payroll records for a project
router.get("/", getPayroll);

// Get payroll by ID
router.get("/:id", getPayrollById);

// Update payroll payment status
router.patch("/:id/payment", updatePayrollPayment);

// Delete payroll
router.delete("/:id", deletePayroll);

export default router;