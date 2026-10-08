import pool from "../config/db.js";

const createInventoryTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                id SERIAL PRIMARY KEY,

                user_id INTEGER NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                project_id INTEGER
                    REFERENCES projects(id)
                    ON DELETE SET NULL,

                material_id INTEGER NOT NULL
                    REFERENCES materials(id)
                    ON DELETE RESTRICT,

                transaction_type VARCHAR(20) NOT NULL
                    CHECK (
                        transaction_type IN (
                            'STOCK_IN',
                            'STOCK_OUT'
                        )
                    ),

                quantity NUMERIC(12,2) NOT NULL
                    CHECK (quantity > 0),

                unit VARCHAR(30) NOT NULL,

                rate NUMERIC(12,2)
                    DEFAULT 0
                    CHECK (rate >= 0),

                reference_type VARCHAR(50),

                reference_id INTEGER,

                notes TEXT,

                transaction_date DATE NOT NULL
                    DEFAULT CURRENT_DATE,

                created_at TIMESTAMP NOT NULL
                    DEFAULT CURRENT_TIMESTAMP,

                updated_at TIMESTAMP NOT NULL
                    DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_inventory_user_id
            ON inventory(user_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_inventory_project_id
            ON inventory(project_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_inventory_material_id
            ON inventory(material_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_inventory_transaction_type
            ON inventory(transaction_type);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_inventory_transaction_date
            ON inventory(transaction_date);
        `);

        console.log(
            "Inventory table created successfully."
        );
    } catch (error) {
        console.error(
            "Inventory table creation failed:",
            error.message
        );
    } finally {
        await pool.end();
    }
};

createInventoryTable();