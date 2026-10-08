import pool from "../config/db.js";

const createMembersTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS members (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                full_name VARCHAR(150) NOT NULL,
                phone VARCHAR(20),
                role VARCHAR(30) NOT NULL DEFAULT 'OTHER',
                joining_date DATE,
                daily_wage NUMERIC(12, 2) DEFAULT 0,
                status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Members table created successfully.");
    } catch (error) {
        console.error("Members table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createMembersTable();