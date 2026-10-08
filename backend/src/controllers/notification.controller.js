import {
    createNotificationService,
    getNotificationsService,
    getNotificationService,
    markNotificationAsReadService,
    markAllNotificationsAsReadService,
    deleteNotificationService
} from "../services/notification.service.js";

import {
    createNotificationSchema
} from "../validators/notification.validator.js";

// Create notification
export const createNotification = async (req, res) => {
    const { error, value } = createNotificationSchema.validate(
        req.body,
        {
            abortEarly: false,
            stripUnknown: true
        }
    );

    if (error) {
        throw error;
    }

    const notification = await createNotificationService(
        value,
        req.user.id
    );

    res.status(201).json({
        success: true,
        message: "Notification created successfully",
        data: notification
    });
};

// Get all notifications
export const getNotifications = async (req, res) => {
    const notifications = await getNotificationsService(
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: notifications
    });
};

// Get notification by ID
export const getNotification = async (req, res) => {
    const notification = await getNotificationService(
        req.params.id,
        req.user.id
    );

    res.status(200).json({
        success: true,
        data: notification
    });
};

// Mark one notification as read
export const markNotificationAsRead = async (req, res) => {
    const notification =
        await markNotificationAsReadService(
            req.params.id,
            req.user.id
        );

    res.status(200).json({
        success: true,
        message: "Notification marked as read",
        data: notification
    });
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (req, res) => {
    const notifications =
        await markAllNotificationsAsReadService(
            req.user.id
        );

    res.status(200).json({
        success: true,
        message: "All notifications marked as read",
        data: notifications
    });
};

// Delete notification
export const deleteNotification = async (req, res) => {
    const notification =
        await deleteNotificationService(
            req.params.id,
            req.user.id
        );

    res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
        data: notification
    });
};