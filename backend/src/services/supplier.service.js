import {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
} from "../repositories/supplier.repository.js";

export const addSupplier = async (
    userId,
    supplierData
) => {
    return await createSupplier(
        userId,
        supplierData
    );
};

export const listSuppliers = async (
    userId
) => {
    return await getSuppliers(userId);
};

export const findSupplier = async (
    userId,
    supplierId
) => {
    const supplier =
        await getSupplierById(
            userId,
            supplierId
        );

    if (!supplier) {
        throw new Error(
            "Supplier not found"
        );
    }

    return supplier;
};

export const editSupplier = async (
    userId,
    supplierId,
    supplierData
) => {
    const existingSupplier =
        await getSupplierById(
            userId,
            supplierId
        );

    if (!existingSupplier) {
        throw new Error(
            "Supplier not found"
        );
    }

    const updatedSupplier =
        await updateSupplier(
            userId,
            supplierId,
            {
                ...existingSupplier,
                ...supplierData,
            }
        );

    return updatedSupplier;
};

export const removeSupplier = async (
    userId,
    supplierId
) => {
    const existingSupplier =
        await getSupplierById(
            userId,
            supplierId
        );

    if (!existingSupplier) {
        throw new Error(
            "Supplier not found"
        );
    }

    return await deleteSupplier(
        userId,
        supplierId
    );
};