import pool from "../config/db.js";

const createProjectsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS projects (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_name VARCHAR(200) NOT NULL,
                client_name VARCHAR(150),
                location VARCHAR(255),
                description TEXT,
                start_date DATE,
                end_date DATE,
                budget NUMERIC(15, 2) DEFAULT 0,
                status VARCHAR(30) NOT NULL DEFAULT 'PLANNED',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Projects table created successfully.");
    } catch (error) {
        console.error("Projects table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createProjectsTable();