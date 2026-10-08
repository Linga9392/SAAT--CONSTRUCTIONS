import express from "express";

import {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
} from "../controllers/purchase.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createPurchase);

router.get("/", getPurchases);

router.get("/:id", getPurchaseById);

router.patch("/:id", updatePurchase);

router.delete("/:id", deletePurchase);

export default router;