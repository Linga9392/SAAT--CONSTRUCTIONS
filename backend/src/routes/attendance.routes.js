import express from "express";

import {
    createAttendance,
    getAttendance,
    getAttendanceById,
    updateAttendance,
    deleteAttendance
} from "../controllers/attendance.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createAttendance);

router.get("/", getAttendance);

router.get("/:id", getAttendanceById);

router.patch("/:id", updateAttendance);

router.delete("/:id", deleteAttendance);

export default router;