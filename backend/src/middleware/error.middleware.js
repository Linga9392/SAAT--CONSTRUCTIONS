import logger from "../config/logger.js";

const errorMiddleware = (err, req, res, next) => {
    logger.error({
        message: err.message,
        method: req.method,
        url: req.originalUrl,
        stack: err.stack
    });

    // Joi Validation Error
    if (err.isJoi) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: err.details.map((detail) => ({
                field: detail.path.join("."),
                message: detail.message
            }))
        });
    }

    // Authentication errors
    if (
        err.message === "Invalid email or password" ||
        err.message === "User account is inactive"
    ) {
        return res.status(401).json({
            success: false,
            message: err.message
        });
    }

    // Duplicate email
    if (err.message === "Email already registered") {
        return res.status(409).json({
            success: false,
            message: err.message
        });
    }

    // Not found
    if (
        err.message === "User not found" ||
        err.message === "Project not found"
    ) {
        return res.status(404).json({
            success: false,
            message: err.message
        });
    }

    // PostgreSQL errors
    if (err.code === "23505") {
        return res.status(409).json({
            success: false,
            message: "Duplicate record"
        });
    }

    if (err.code === "23503") {
        return res.status(400).json({
            success: false,
            message: "Referenced record does not exist"
        });
    }

    // Default error
    return res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal server error"
    });
};

export default errorMiddleware;