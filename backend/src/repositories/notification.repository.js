import pool from "../config/db.js";

// Create a notification
export const createNotification = async ({
    user_id,
    project_id,
    title,
    message,
    type
}) => {
    const result = await pool.query(
        `
        INSERT INTO notifications (
            user_id,
            project_id,
            title,
            message,
            type
        )
        VALUES ($1,$2,$3,$4,$5)
        RETURNING *
        `,
        [
            user_id,
            project_id,
            title,
            message,
            type
        ]
    );

    return result.rows[0];
};

// Get all notifications for a user
export const getNotificationsByUser = async (
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM notifications
        WHERE user_id = $1
        ORDER BY created_at DESC, id DESC
        `,
        [user_id]
    );

    return result.rows;
};

// Get notification by ID
export const getNotificationById = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM notifications
        WHERE id = $1
        AND user_id = $2
        LIMIT 1
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Mark notification as read
export const markNotificationAsRead = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        UPDATE notifications
        SET
            is_read = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
        AND user_id = $2
        RETURNING *
        `,
        [id, user_id]
    );

    return result.rows[0];
};

// Mark all notifications as read
export const markAllNotificationsAsRead = async (
    user_id
) => {
    const result = await pool.query(
        `
        UPDATE notifications
        SET
            is_read = TRUE,
            updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1
        AND is_read = FALSE
        RETURNING id
        `,
        [user_id]
    );

    return result.rows;
};

// Delete notification
export const deleteNotification = async (
    id,
    user_id
) => {
    const result = await pool.query(
        `
        DELETE FROM notifications
        WHERE id = $1
        AND user_id = $2
        RETURNING id
        `,
        [id, user_id]
    );

    return result.rows[0];
};

export default {
    createNotification,
    getNotificationsByUser,
    getNotificationById,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
};