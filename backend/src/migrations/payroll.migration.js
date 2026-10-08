import pool from "../config/db.js";

const createPayrollTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS payroll (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
                salary_month DATE NOT NULL,
                total_days INTEGER NOT NULL DEFAULT 0,
                present_days INTEGER NOT NULL DEFAULT 0,
                half_days INTEGER NOT NULL DEFAULT 0,
                absent_days INTEGER NOT NULL DEFAULT 0,
                overtime_hours NUMERIC(5, 2) NOT NULL DEFAULT 0,
                total_salary NUMERIC(12, 2) NOT NULL DEFAULT 0,
                payment_status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
                paid_at TIMESTAMP,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT unique_member_salary_month
                    UNIQUE (member_id, salary_month)
            );
        `);

        console.log("Payroll table created successfully.");
    } catch (error) {
        console.error("Payroll table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createPayrollTable();