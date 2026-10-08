import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import {
    uploadDocument,
    getDocuments,
    getDocument,
    downloadDocument,
    deleteDocument
} from "../controllers/document.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

// Create uploads directory if it does not exist
const uploadDirectory = "uploads/documents";

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true
    });
}

// Configure file storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(
            file.originalname
        );

        const fileName =
            `${Date.now()}-${Math.round(Math.random() * 1E9)}${extension}`;

        cb(null, fileName);
    }
});

// Configure multer
const upload = multer({
    storage
});

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

// Get document by ID
router.get(
    "/:id",
    getDocument
);

// Download document
router.get(
    "/:id/download",
    downloadDocument
);

// Delete document
router.delete(
    "/:id",
    deleteDocument
);

export default router;