import express from "express";

import {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} from "../controllers/supplier.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post(
    "/",
    createSupplier
);

router.get(
    "/",
    getSuppliers
);

router.get(
    "/:id",
    getSupplierById
);

router.patch(
    "/:id",
    updateSupplier
);

router.delete(
    "/:id",
    deleteSupplier
);

export default router;