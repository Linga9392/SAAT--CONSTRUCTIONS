import {
    addSupplier,
    listSuppliers,
    findSupplier,
    editSupplier,
    removeSupplier,
} from "../services/supplier.service.js";

import {
    createSupplierSchema,
    updateSupplierSchema,
} from "../validators/supplier.validator.js";

export const createSupplier = async (
    req,
    res
) => {
    try {
        const {
            error,
            value,
        } = createSupplierSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map(
                    (detail) =>
                        detail.message
                ),
            });
        }

        const supplier =
            await addSupplier(
                req.user.id,
                value
            );

        return res.status(201).json({
            success: true,
            message:
                "Supplier created successfully",
            data: supplier,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSuppliers = async (
    req,
    res
) => {
    try {
        const suppliers =
            await listSuppliers(
                req.user.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Suppliers fetched successfully",
            data: suppliers,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const getSupplierById = async (
    req,
    res
) => {
    try {
        const supplier =
            await findSupplier(
                req.user.id,
                req.params.id
            );

        return res.status(200).json({
            success: true,
            message:
                "Supplier fetched successfully",
            data: supplier,
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Supplier not found"
                ? 404
                : 500;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateSupplier = async (
    req,
    res
) => {
    try {
        const {
            error,
            value,
        } = updateSupplierSchema.validate(
            req.body,
            {
                abortEarly: false,
                stripUnknown: true,
            }
        );

        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.details.map(
                    (detail) =>
                        detail.message
                ),
            });
        }

        const supplier =
            await editSupplier(
                req.user.id,
                req.params.id,
                value
            );

        return res.status(200).json({
            success: true,
            message:
                "Supplier updated successfully",
            data: supplier,
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Supplier not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

export const deleteSupplier = async (
    req,
    res
) => {
    try {
        await removeSupplier(
            req.user.id,
            req.params.id
        );

        return res.status(200).json({
            success: true,
            message:
                "Supplier deleted successfully",
        });
    } catch (error) {
        const statusCode =
            error.message ===
            "Supplier not found"
                ? 404
                : 400;

        return res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};