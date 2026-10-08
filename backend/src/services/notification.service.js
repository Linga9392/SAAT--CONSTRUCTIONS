import {
    createNotification,
    getNotificationsByUser,
    getNotificationById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from "../repositories/notification.repository.js";

import {
    getProjectById
} from "../repositories/project.repository.js";

// Create notification
export const createNotificationService = async (
    data,
    user_id
) => {
    // Verify project ownership when project_id is provided
    if (data.project_id) {
        const project = await getProjectById(
            data.project_id,
            user_id
        );

        if (!project) {
            const error = new Error("Project not found");
            error.statusCode = 404;
            throw error;
        }
    }

    return await createNotification({
        ...data,
        user_id
    });
};

// Get all notifications
export const getNotificationsService = async (
    user_id
) => {
    return await getNotificationsByUser(user_id);
};

// Get notification by ID
export const getNotificationService = async (
    id,
    user_id
) => {
    const notification = await getNotificationById(
        id,
        user_id
    );

    if (!notification) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }

    return notification;
};

// Mark one notification as read
export const markNotificationAsReadService = async (
    id,
    user_id
) => {
    const notification = await markNotificationAsRead(
        id,
        user_id
    );

    if (!notification) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }

    return notification;
};

// Mark all notifications as read
export const markAllNotificationsAsReadService = async (
    user_id
) => {
    return await markAllNotificationsAsRead(user_id);
};

// Delete notification
export const deleteNotificationService = async (
    id,
    user_id
) => {
    const notification = await deleteNotification(
        id,
        user_id
    );

    if (!notification) {
        const error = new Error("Notification not found");
        error.statusCode = 404;
        throw error;
    }

    return notification;
};