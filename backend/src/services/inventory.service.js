import {
    createInventoryTransaction,
    getInventoryTransactions,
    getInventoryTransactionById,
    getCurrentStock,
    deleteInventoryTransaction,
} from "../repositories/inventory.repository.js";

const checkStockAvailability = async (
    userId,
    materialId,
    quantity
) => {
    const stock = await getCurrentStock(userId);

    const materialStock = stock.find(
        (item) =>
            Number(item.material_id) ===
            Number(materialId)
    );

    const availableStock = materialStock
        ? Number(materialStock.current_stock)
        : 0;

    if (quantity > availableStock) {
        throw new Error(
            `Insufficient stock. Available stock: ${availableStock}`
        );
    }

    return availableStock;
};

export const addInventoryTransaction = async (
    userId,
    data
) => {
    if (
        data.transaction_type ===
        "STOCK_OUT"
    ) {
        await checkStockAvailability(
            userId,
            data.material_id,
            Number(data.quantity)
        );
    }

    return await createInventoryTransaction(
        userId,
        data
    );
};

export const listInventoryTransactions = async (
    userId
) => {
    return await getInventoryTransactions(
        userId
    );
};

export const findInventoryTransaction = async (
    userId,
    inventoryId
) => {
    const transaction =
        await getInventoryTransactionById(
            userId,
            inventoryId
        );

    if (!transaction) {
        throw new Error(
            "Inventory transaction not found"
        );
    }

    return transaction;
};

export const getStockSummary = async (
    userId
) => {
    return await getCurrentStock(userId);
};

export const removeInventoryTransaction = async (
    userId,
    inventoryId
) => {
    const transaction =
        await getInventoryTransactionById(
            userId,
            inventoryId
        );

    if (!transaction) {
        throw new Error(
            "Inventory transaction not found"
        );
    }

    return await deleteInventoryTransaction(
        userId,
        inventoryId
    );
};