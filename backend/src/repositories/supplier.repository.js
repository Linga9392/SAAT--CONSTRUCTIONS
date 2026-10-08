import pool from "../config/db.js";

export const createSupplier = async (
    userId,
    data
) => {
    const result = await pool.query(
        `
        INSERT INTO suppliers (
            user_id,
            supplier_name,
            company_name,
            phone,
            email,
            address,
            gst_number,
            material_types,
            status
        )
        VALUES (
            $1, $2, $3, $4, $5,
            $6, $7, $8, $9
        )
        RETURNING *
        `,
        [
            userId,
            data.supplier_name,
            data.company_name,
            data.phone,
            data.email,
            data.address,
            data.gst_number,
            data.material_types,
            data.status,
        ]
    );

    return result.rows[0];
};

export const getSuppliers = async (
    userId
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM suppliers
        WHERE user_id = $1
        ORDER BY created_at DESC, id DESC
        `,
        [userId]
    );

    return result.rows;
};

export const getSupplierById = async (
    userId,
    supplierId
) => {
    const result = await pool.query(
        `
        SELECT *
        FROM suppliers
        WHERE
            id = $1
            AND user_id = $2
        LIMIT 1
        `,
        [
            supplierId,
            userId,
        ]
    );

    return result.rows[0];
};

export const updateSupplier = async (
    userId,
    supplierId,
    data
) => {
    const result = await pool.query(
        `
        UPDATE suppliers
        SET
            supplier_name = $1,
            company_name = $2,
            phone = $3,
            email = $4,
            address = $5,
            gst_number = $6,
            material_types = $7,
            status = $8,
            updated_at = CURRENT_TIMESTAMP
        WHERE
            id = $9
            AND user_id = $10
        RETURNING *
        `,
        [
            data.supplier_name,
            data.company_name,
            data.phone,
            data.email,
            data.address,
            data.gst_number,
            data.material_types,
            data.status,
            supplierId,
            userId,
        ]
    );

    return result.rows[0];
};

export const deleteSupplier = async (
    userId,
    supplierId
) => {
    const result = await pool.query(
        `
        DELETE FROM suppliers
        WHERE
            id = $1
            AND user_id = $2
        RETURNING id
        `,
        [
            supplierId,
            userId,
        ]
    );

    return result.rows[0];
};

export default {
    createSupplier,
    getSuppliers,
    getSupplierById,
    updateSupplier,
    deleteSupplier,
};