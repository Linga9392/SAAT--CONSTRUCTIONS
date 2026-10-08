import pool from "../config/db.js";

const createPurchasesTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS purchases (
                id SERIAL PRIMARY KEY,

                user_id INTEGER NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                project_id INTEGER
                    REFERENCES projects(id)
                    ON DELETE SET NULL,

                supplier_id INTEGER NOT NULL
                    REFERENCES suppliers(id)
                    ON DELETE RESTRICT,

                material_id INTEGER NOT NULL
                    REFERENCES materials(id)
                    ON DELETE RESTRICT,

                invoice_number VARCHAR(100),

                purchase_date DATE NOT NULL
                    DEFAULT CURRENT_DATE,

                quantity NUMERIC(12,2) NOT NULL
                    CHECK (quantity > 0),

                unit VARCHAR(30) NOT NULL,

                rate NUMERIC(12,2) NOT NULL
                    CHECK (rate >= 0),

                total_amount NUMERIC(14,2) NOT NULL
                    CHECK (total_amount >= 0),

                paid_amount NUMERIC(14,2) NOT NULL
                    DEFAULT 0
                    CHECK (paid_amount >= 0),

                pending_amount NUMERIC(14,2) NOT NULL
                    DEFAULT 0
                    CHECK (pending_amount >= 0),

                payment_status VARCHAR(20) NOT NULL
                    DEFAULT 'PENDING'
                    CHECK (
                        payment_status IN (
                            'PENDING',
                            'PARTIAL',
                            'PAID'
                        )
                    ),

                notes TEXT,

                created_at TIMESTAMP NOT NULL
                    DEFAULT CURRENT_TIMESTAMP,

                updated_at TIMESTAMP NOT NULL
                    DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_purchases_user_id
            ON purchases(user_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_purchases_project_id
            ON purchases(project_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_purchases_supplier_id
            ON purchases(supplier_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_purchases_material_id
            ON purchases(material_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_purchases_date
            ON purchases(purchase_date);
        `);

        console.log(
            "Purchases table created successfully."
        );
    } catch (error) {
        console.error(
            "Purchases table creation failed:",
            error.message
        );
    } finally {
        await pool.end();
    }
};

createPurchasesTable();