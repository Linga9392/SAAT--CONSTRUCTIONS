import {
    addPurchase,
    listPurchases,
    findPurchase,
    editPurchase,
    removePurchase,
} from "../services/purchase.service.js";

export const createPurchase = async (
    req,
    res
) => {
    try {
        const purchase =
            await addPurchase(
                req.user.id,
                req.body
            );

        return res.status(201).json({
            success: true,
            message:
                "Purchase created successfully",
            data: purchase,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPurchases = async (
    req,
    res
) => {
    try {
        const purchases =
            await listPurchases(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Purchases fetched successfully",
            data: purchases,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getPurchaseById = async (
    req,
    res
) => {
    try {
        const purchase =
            await findPurchase(
                req.user.id,
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Purchase fetched successfully",
            data: purchase,
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Purchase not found"
                ? 404
                : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePurchase = async (
    req,
    res
) => {
    try {
        const purchase =
            await editPurchase(
                req.user.id,
                req.params.id,
                req.body
            );

        return res.status(200).json({
            success: true,
            message:
                "Purchase updated successfully",
            data: purchase,
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Purchase not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const deletePurchase = async (
    req,
    res
) => {
    try {
        await removePurchase(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Purchase deleted successfully",
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Purchase not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};