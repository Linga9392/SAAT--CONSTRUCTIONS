import pool from "../config/db.js";

export const createInventoryTransaction = async (
    userId,
    data
) => {
    const result = await pool.query(
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
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9, $10, $11
        )
        RETURNING *
        `,
        [
            userId,
            data.project_id,
            data.material_id,
            data.transaction_type,
            data.quantity,
            data.unit,
            data.rate,
            data.reference_type,
            data.reference_id,
            data.notes,
            data.transaction_date,
        ]
    );

    return result.rows[0];
};

export const getInventoryTransactions = async (
    userId
) => {
    const result = await pool.query(
        `
        SELECT
            i.*,
            m.material_name,
            m.category,
            m.unit AS material_unit,
            p.project_name
        FROM inventory i

        INNER JOIN materials m
            ON i.material_id = m.id

        LEFT JOIN projects p
            ON i.project_id = p.id

        WHERE i.user_id = $1

        ORDER BY
            i.transaction_date DESC,
            i.id DESC
        `,
        [userId]
    );

    return result.rows;
};

export const getInventoryTransactionById = async (
    userId,
    inventoryId
) => {
    const result = await pool.query(
        `
        SELECT
            i.*,
            m.material_name,
            m.category,
            m.unit AS material_unit,
            p.project_name
        FROM inventory i

        INNER JOIN materials m
            ON i.material_id = m.id

        LEFT JOIN projects p
            ON i.project_id = p.id

        WHERE
            i.id = $1
            AND i.user_id = $2

        LIMIT 1
        `,
        [
            inventoryId,
            userId,
        ]
    );

    return result.rows[0];
};

export const getCurrentStock = async (
    userId
) => {
    const result = await pool.query(
        `
        SELECT
            m.id AS material_id,
            m.material_name,
            m.category,
            m.unit AS material_unit,

            COALESCE(
                SUM(
                    CASE
                        WHEN i.transaction_type = 'STOCK_IN'
                        THEN i.quantity
                        ELSE 0
                    END
                ),
                0
            ) AS total_stock_in,

            COALESCE(
                SUM(
                    CASE
                        WHEN i.transaction_type = 'STOCK_OUT'
                        THEN i.quantity
                        ELSE 0
                    END
                ),
                0
            ) AS total_stock_out,

            COALESCE(
                SUM(
                    CASE
                        WHEN i.transaction_type = 'STOCK_IN'
                        THEN i.quantity
                        WHEN i.transaction_type = 'STOCK_OUT'
                        THEN -i.quantity
                        ELSE 0
                    END
                ),
                0
            ) AS current_stock

        FROM materials m

        LEFT JOIN inventory i
            ON m.id = i.material_id
            AND i.user_id = $1

        GROUP BY
            m.id,
            m.material_name,
            m.category,
            m.unit

        ORDER BY
            m.material_name ASC
        `,
        [userId]
    );

    return result.rows;
};

export const deleteInventoryTransaction = async (
    userId,
    inventoryId
) => {
    const result = await pool.query(
        `
        DELETE FROM inventory

        WHERE
            id = $1
            AND user_id = $2

        RETURNING id
        `,
        [
            inventoryId,
            userId,
        ]
    );

    return result.rows[0];
};

export default {
    createInventoryTransaction,
    getInventoryTransactions,
    getInventoryTransactionById,
    getCurrentStock,
    deleteInventoryTransaction,
};