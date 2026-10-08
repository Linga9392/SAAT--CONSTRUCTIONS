import {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
} from "../repositories/purchase.repository.js";

const calculatePurchaseAmounts = (
    quantity,
    rate,
    paidAmount = 0
) => {
    const totalAmount =
        Number(quantity) * Number(rate);

    const paid =
        Number(paidAmount);

    if (paid < 0) {
        throw new Error(
            "Paid amount cannot be negative"
        );
    }

    if (paid > totalAmount) {
        throw new Error(
            "Paid amount cannot be greater than total amount"
        );
    }

    const pendingAmount =
        totalAmount - paid;

    let paymentStatus = "PENDING";

    if (
        paid === totalAmount &&
        totalAmount > 0
    ) {
        paymentStatus = "PAID";
    } else if (paid > 0) {
        paymentStatus = "PARTIAL";
    }

    return {
        total_amount: totalAmount,
        paid_amount: paid,
        pending_amount: pendingAmount,
        payment_status: paymentStatus,
    };
};

export const addPurchase = async (
    userId,
    purchaseData
) => {
    const {
        quantity,
        rate,
        paid_amount = 0,
    } = purchaseData;

    const amounts =
        calculatePurchaseAmounts(
            quantity,
            rate,
            paid_amount
        );

    return await createPurchase(
        userId,
        {
            ...purchaseData,
            ...amounts,
        }
    );
};

export const listPurchases = async (
    userId
) => {
    return await getPurchases(userId);
};

export const findPurchase = async (
    userId,
    purchaseId
) => {
    const purchase =
        await getPurchaseById(
            userId,
            purchaseId
        );

    if (!purchase) {
        throw new Error(
            "Purchase not found"
        );
    }

    return purchase;
};

export const editPurchase = async (
    userId,
    purchaseId,
    purchaseData
) => {
    const existingPurchase =
        await getPurchaseById(
            userId,
            purchaseId
        );

    if (!existingPurchase) {
        throw new Error(
            "Purchase not found"
        );
    }

    const quantity =
        purchaseData.quantity ??
        existingPurchase.quantity;

    const rate =
        purchaseData.rate ??
        existingPurchase.rate;

    const paidAmount =
        purchaseData.paid_amount ??
        existingPurchase.paid_amount;

    const amounts =
        calculatePurchaseAmounts(
            quantity,
            rate,
            paidAmount
        );

    return await updatePurchase(
        userId,
        purchaseId,
        {
            ...existingPurchase,
            ...purchaseData,
            ...amounts,
        }
    );
};

export const removePurchase = async (
    userId,
    purchaseId
) => {
    const existingPurchase =
        await getPurchaseById(
            userId,
            purchaseId
        );

    if (!existingPurchase) {
        throw new Error(
            "Purchase not found"
        );
    }

    return await deletePurchase(
        userId,
        purchaseId
    );
};