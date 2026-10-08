import pool from "../config/db.js";

const getCurrentStockForMaterial = async (
    client,
    userId,
    materialId
) => {
    const result = await client.query(
        `
        SELECT
            COALESCE(
                SUM(
                    CASE
                        WHEN transaction_type = 'STOCK_IN'
                        THEN quantity
                        WHEN transaction_type = 'STOCK_OUT'
                        THEN -quantity
                        ELSE 0
                    END
                ),
                0
            ) AS current_stock

        FROM inventory

        WHERE
            user_id = $1
            AND material_id = $2
        `,
        [
            userId,
            materialId,
        ]
    );

    return Number(
        result.rows[0]?.current_stock || 0
    );
};

export const createPurchase = async (
    userId,
    data
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const purchaseResult =
            await client.query(
                `
                INSERT INTO purchases (
                    user_id,
                    project_id,
                    supplier_id,
                    material_id,
                    invoice_number,
                    purchase_date,
                    quantity,
                    unit,
                    rate,
                    total_amount,
                    paid_amount,
                    pending_amount,
                    payment_status,
                    notes
                )
                VALUES (
                    $1, $2, $3, $4, $5, $6, $7,
                    $8, $9, $10, $11, $12, $13, $14
                )
                RETURNING *
                `,
                [
                    userId,
                    data.project_id,
                    data.supplier_id,
                    data.material_id,
                    data.invoice_number,
                    data.purchase_date,
                    data.quantity,
                    data.unit,
                    data.rate,
                    data.total_amount,
                    data.paid_amount,
                    data.pending_amount,
                    data.payment_status,
                    data.notes,
                ]
            );

        const purchase =
            purchaseResult.rows[0];

        await client.query(
            `
            INSERT INTO inventory (
                user_id,
                project_id,
                material_id,
                transaction_type,
                quantity,
                unit,
                rate,
                reference_type,
                reference_id,
                notes,
                transaction_date
            )
            VALUES (
                $1,
                $2,
                $3,
                'STOCK_IN',
                $4,
                $5,
                $6,
                'PURCHASE',
                $7,
                $8,
                $9
            )
            `,
            [
                userId,
                data.project_id,
                data.material_id,
                data.quantity,
                data.unit,
                data.rate,
                purchase.id,
                `Stock received from purchase #${purchase.id}`,
                data.purchase_date,
            ]
        );

        await client.query("COMMIT");

        return purchase;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const getPurchases = async (
    userId
) => {
    const result = await pool.query(
        `
        SELECT
            p.*,
            s.supplier_name,
            s.company_name,
            pr.project_name,
            m.material_name,
            m.category,
            m.unit AS material_unit

        FROM purchases p

        INNER JOIN suppliers s
            ON p.supplier_id = s.id

        LEFT JOIN projects pr
            ON p.project_id = pr.id

        INNER JOIN materials m
            ON p.material_id = m.id

        WHERE p.user_id = $1

        ORDER BY
            p.purchase_date DESC,
            p.id DESC
        `,
        [userId]
    );

    return result.rows;
};

export const getPurchaseById = async (
    userId,
    purchaseId
) => {
    const result = await pool.query(
        `
        SELECT
            p.*,
            s.supplier_name,
            s.company_name,
            s.phone,
            s.email,
            pr.project_name,
            m.material_name,
            m.category,
            m.unit AS material_unit

        FROM purchases p

        INNER JOIN suppliers s
            ON p.supplier_id = s.id

        LEFT JOIN projects pr
            ON p.project_id = pr.id

        INNER JOIN materials m
            ON p.material_id = m.id

        WHERE
            p.id = $1
            AND p.user_id = $2

        LIMIT 1
        `,
        [
            purchaseId,
            userId,
        ]
    );

    return result.rows[0];
};

export const updatePurchase = async (
    userId,
    purchaseId,
    data
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const existingResult =
            await client.query(
                `
                SELECT *
                FROM purchases

                WHERE
                    id = $1
                    AND user_id = $2

                LIMIT 1
                `,
                [
                    purchaseId,
                    userId,
                ]
            );

        const existingPurchase =
            existingResult.rows[0];

        if (!existingPurchase) {
            throw new Error(
                "Purchase not found"
            );
        }

        const oldMaterialId =
            Number(
                existingPurchase.material_id
            );

        const newMaterialId =
            Number(data.material_id);

        const oldQuantity =
            Number(
                existingPurchase.quantity
            );

        const newQuantity =
            Number(data.quantity);

        const oldCurrentStock =
            await getCurrentStockForMaterial(
                client,
                userId,
                oldMaterialId
            );

        const oldStockAfterUpdate =
            oldCurrentStock -
            oldQuantity;

        if (oldStockAfterUpdate < 0) {
            throw new Error(
                `Cannot update purchase. Existing stock for material ${oldMaterialId} would become negative. Current stock: ${oldCurrentStock}`
            );
        }

        if (
            oldMaterialId !==
            newMaterialId
        ) {
            const newCurrentStock =
                await getCurrentStockForMaterial(
                    client,
                    userId,
                    newMaterialId
                );

            if (newCurrentStock < 0) {
                throw new Error(
                    `Cannot update purchase. Stock for material ${newMaterialId} is already negative.`
                );
            }
        }

        const purchaseResult =
            await client.query(
                `
                UPDATE purchases

                SET
                    project_id = $1,
                    supplier_id = $2,
                    material_id = $3,
                    invoice_number = $4,
                    purchase_date = $5,
                    quantity = $6,
                    unit = $7,
                    rate = $8,
                    total_amount = $9,
                    paid_amount = $10,
                    pending_amount = $11,
                    payment_status = $12,
                    notes = $13,
                    updated_at = CURRENT_TIMESTAMP

                WHERE
                    id = $14
                    AND user_id = $15

                RETURNING *
                `,
                [
                    data.project_id,
                    data.supplier_id,
                    data.material_id,
                    data.invoice_number,
                    data.purchase_date,
                    data.quantity,
                    data.unit,
                    data.rate,
                    data.total_amount,
                    data.paid_amount,
                    data.pending_amount,
                    data.payment_status,
                    data.notes,
                    purchaseId,
                    userId,
                ]
            );

        const purchase =
            purchaseResult.rows[0];

        await client.query(
            `
            DELETE FROM inventory

            WHERE
                user_id = $1
                AND reference_type = 'PURCHASE'
                AND reference_id = $2
                AND transaction_type = 'STOCK_IN'
            `,
            [
                userId,
                purchaseId,
            ]
        );

        await client.query(
            `
            INSERT INTO inventory (
                user_id,
                project_id,
                material_id,
                transaction_type,
                quantity,
                unit,
                rate,
                reference_type,
                reference_id,
                notes,
                transaction_date
            )
            VALUES (
                $1,
                $2,
                $3,
                'STOCK_IN',
                $4,
                $5,
                $6,
                'PURCHASE',
                $7,
                $8,
                $9
            )
            `,
            [
                userId,
                data.project_id,
                data.material_id,
                data.quantity,
                data.unit,
                data.rate,
                purchaseId,
                `Stock received from purchase #${purchaseId}`,
                data.purchase_date,
            ]
        );

        await client.query("COMMIT");

        return purchase;
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export const deletePurchase = async (
    userId,
    purchaseId
) => {
    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const existingResult =
            await client.query(
                `
                SELECT *
                FROM purchases

                WHERE
                    id = $1
                    AND user_id = $2

                LIMIT 1
                `,
                [
                    purchaseId,
                    userId,
                ]
            );

        const existingPurchase =
            existingResult.rows[0];

        if (!existingPurchase) {
            throw new Error(
                "Purchase not found"
            );
        }

        const materialId =
            Number(
                existingPurchase.material_id
            );

        const purchaseQuantity =
            Number(
                existingPurchase.quantity
            );

        const currentStock =
            await getCurrentStockForMaterial(
                client,
                userId,
                materialId
            );

        const stockAfterDelete =
            currentStock -
            purchaseQuantity;

        if (stockAfterDelete < 0) {
            throw new Error(
                `Cannot delete purchase. Stock would become negative. Current stock: ${currentStock}, purchase quantity: ${purchaseQuantity}`
            );
        }

        await client.query(
            `
            DELETE FROM inventory

            WHERE
                user_id = $1
                AND reference_type = 'PURCHASE'
                AND reference_id = $2
                AND transaction_type = 'STOCK_IN'
            `,
            [
                userId,
                purchaseId,
            ]
        );

        const deleteResult =
            await client.query(
                `
                DELETE FROM purchases

                WHERE
                    id = $1
                    AND user_id = $2

                RETURNING id
                `,
                [
                    purchaseId,
                    userId,
                ]
            );

        if (
            !deleteResult.rows[0]
        ) {
            throw new Error(
                "Purchase not found"
            );
        }

        await client.query("COMMIT");

        return deleteResult.rows[0];
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
};

export default {
    createPurchase,
    getPurchases,
    getPurchaseById,
    updatePurchase,
    deletePurchase,
};