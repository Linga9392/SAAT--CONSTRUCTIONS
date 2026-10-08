import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import logger from "./src/config/logger.js";

// Swagger
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

// Import routes
import authRoutes from "./src/routes/auth.routes.js";
import projectRoutes from "./src/routes/project.routes.js";
import memberRoutes from "./src/routes/member.routes.js";
import attendanceRoutes from "./src/routes/attendance.routes.js";
import payrollRoutes from "./src/routes/payroll.routes.js";
import materialRoutes from "./src/routes/material.routes.js";
import siteReportRoutes from "./src/routes/site-report.routes.js";
import expenseRoutes from "./src/routes/expense.routes.js";
import projectItemRoutes from "./src/routes/project-item.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import reportRoutes from "./src/routes/report.routes.js";
import documentRoutes from "./src/routes/document.routes.js";
import notificationRoutes from "./src/routes/notification.routes.js";
import profileRoutes from "./src/routes/profile.routes.js";

import supplierRoutes from "./src/routes/supplier.routes.js";
import purchaseRoutes from "./src/routes/purchase.routes.js";
import inventoryRoutes from "./src/routes/inventory.routes.js";
import siteProgressRoutes from "./src/routes/siteProgress.routes.js";

import errorMiddleware from "./src/middleware/error.middleware.js";

dotenv.config();

const app = express();

// Enable CORS for frontend
app.use(cors());

// Parse JSON request body
app.use(express.json());

// Parse URL encoded request body
app.use(
    express.urlencoded({
        extended: true
    })
);

// Swagger API documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDocument)
);

// Health check API
app.get("/", (req, res) => {
    logger.info("Health check API called");

    res.json({
        success: true,
        app: "SAAT CONSTRUCTION",
        message: "SAAT Construction Backend Running"
    });
});

// Authentication APIs
app.use(
    "/api/v1/auth",
    authRoutes
);

// Project APIs
app.use(
    "/api/v1/projects",
    projectRoutes
);

// Member APIs
app.use(
    "/api/v1/members",
    memberRoutes
);

// Attendance APIs
app.use(
    "/api/v1/attendance",
    attendanceRoutes
);

// Payroll APIs
app.use(
    "/api/v1/payroll",
    payrollRoutes
);

// Material APIs
app.use(
    "/api/v1/materials",
    materialRoutes
);

// Site Report APIs
app.use(
    "/api/v1/site-reports",
    siteReportRoutes
);

// Expense APIs
app.use(
    "/api/v1/expenses",
    expenseRoutes
);

// Project Item / BOQ APIs
app.use(
    "/api/v1/project-items",
    projectItemRoutes
);

// Dashboard APIs
app.use(
    "/api/v1/dashboard",
    dashboardRoutes
);

// Report APIs
app.use(
    "/api/v1/reports",
    reportRoutes
);

// Document APIs
app.use(
    "/api/v1/documents",
    documentRoutes
);

// Notification APIs
app.use(
    "/api/v1/notifications",
    notificationRoutes
);

// Profile APIs
app.use(
    "/api/v1/profile",
    profileRoutes
);

// Supplier APIs
app.use(
    "/api/v1/suppliers",
    supplierRoutes
);

// Purchase APIs
app.use(
    "/api/v1/purchases",
    purchaseRoutes
);

// Inventory APIs
app.use(
    "/api/v1/inventory",
    inventoryRoutes
);

// Site Progress APIs
app.use(
    "/api/v1/site-progress",
    siteProgressRoutes
);

// Global error handler
app.use(errorMiddleware);

// Server configuration
const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, "0.0.0.0", () => {
    logger.info(
        `SAAT Construction Server running on port ${PORT}`
    );
});