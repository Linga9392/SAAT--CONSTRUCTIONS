import express from "express";

import {
    createInventory,
    getInventory,
    getInventoryById,
    getInventoryStock,
    deleteInventory,
} from "../controllers/inventory.controller.js";

import authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createInventory);

router.get("/", getInventory);

router.get("/stock", getInventoryStock);

router.get("/:id", getInventoryById);

router.delete("/:id", deleteInventory);

export default router;