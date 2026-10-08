import pool from "../config/db.js";

const createMaterialsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS materials (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                material_name VARCHAR(150) NOT NULL,
                category VARCHAR(100),
                unit VARCHAR(30) NOT NULL,
                quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
                purchase_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
                supplier_name VARCHAR(150),
                minimum_stock NUMERIC(12, 2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Materials table created successfully.");
    } catch (error) {
        console.error("Materials table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createMaterialsTable();