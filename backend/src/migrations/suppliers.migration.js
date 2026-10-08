import pool from "../config/db.js";

const createSuppliersTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS suppliers (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                supplier_name VARCHAR(150) NOT NULL,
                company_name VARCHAR(150),
                phone VARCHAR(20),
                email VARCHAR(150),
                address TEXT,
                gst_number VARCHAR(30),
                material_types TEXT,
                status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_suppliers_user_id
            ON suppliers(user_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_suppliers_status
            ON suppliers(status);
        `);

        console.log("Suppliers table created successfully.");
    } catch (error) {
        console.error(
            "Suppliers table creation failed:",
            error.message
        );
    } finally {
        await pool.end();
    }
};

createSuppliersTable();