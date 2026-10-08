import pool from "../config/db.js";

const createBOQTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS boq (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                item_name VARCHAR(200) NOT NULL,
                description TEXT,
                unit VARCHAR(50) NOT NULL,
                quantity NUMERIC(12, 2) NOT NULL DEFAULT 0,
                unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0,
                total_amount NUMERIC(15, 2)
                    GENERATED ALWAYS AS (quantity * unit_price) STORED,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("BOQ table created successfully.");
    } catch (error) {
        console.error("BOQ table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createBOQTable();