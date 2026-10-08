import express from "express";

import {
    uploadDocument,
    getDocuments,
    getDocument,
    downloadDocument,
    deleteDocument
} from "../controllers/document.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";
import upload from "../middleware/upload.middleware.js";

const router = express.Router();

// Apply authentication to all document APIs
router.use(authMiddleware);

// Upload document
router.post(
    "/",
    upload.single("file"),
    uploadDocument
);

// Get documents for a project
router.get(
    "/",
    getDocuments
);

// Download document
router.get(
    "/:id/download",
    downloadDocument
);

// Get document by ID
router.get(
    "/:id",
    getDocument
);

// Delete document
router.delete(
    "/:id",
    deleteDocument
);

export default router;