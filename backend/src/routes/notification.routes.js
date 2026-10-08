import express from "express";

import {
    createNotification,
    getNotifications,
    getNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../controllers/notification.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Apply authentication to all notification APIs
router.use(authMiddleware);

// Create notification
router.post("/", createNotification);

// Get all notifications
router.get("/", getNotifications);

// Get notification by ID
router.get("/:id", getNotification);

// Mark all notifications as read
router.patch("/read-all", markAllNotificationsAsRead);

// Mark one notification as read
router.patch("/:id/read", markNotificationAsRead);

// Delete notification
router.delete("/:id", deleteNotification);

export default router;