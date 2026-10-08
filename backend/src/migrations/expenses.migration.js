import pool from "../config/db.js";

const createExpensesTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS expenses (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                expense_date DATE NOT NULL,
                category VARCHAR(100) NOT NULL,
                description TEXT,
                amount NUMERIC(12, 2) NOT NULL CHECK (amount > 0),
                payment_method VARCHAR(30) NOT NULL DEFAULT 'CASH',
                vendor_name VARCHAR(150),
                reference_number VARCHAR(100),
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Expenses table created successfully.");
    } catch (error) {
        console.error("Expenses table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createExpensesTable();