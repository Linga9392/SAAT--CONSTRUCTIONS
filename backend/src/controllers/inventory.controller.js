import {
    addInventoryTransaction,
    listInventoryTransactions,
    findInventoryTransaction,
    getStockSummary,
    removeInventoryTransaction,
} from "../services/inventory.service.js";

export const createInventory = async (
    req,
    res
) => {
    try {
        const inventory =
            await addInventoryTransaction(
                req.user.id,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Inventory transaction created successfully",
            data: inventory,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getInventory = async (
    req,
    res
) => {
    try {
        const inventory =
            await listInventoryTransactions(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Inventory transactions fetched successfully",
            data: inventory,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getInventoryById = async (
    req,
    res
) => {
    try {
        const inventory =
            await findInventoryTransaction(
                req.user.id,
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Inventory transaction fetched successfully",
            data: inventory,
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Inventory transaction not found"
                ? 404
                : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const getInventoryStock = async (
    req,
    res
) => {
    try {
        const stock =
            await getStockSummary(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Current stock fetched successfully",
            data: stock,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteInventory = async (
    req,
    res
) => {
    try {
        await removeInventoryTransaction(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Inventory transaction deleted successfully",
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Inventory transaction not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};