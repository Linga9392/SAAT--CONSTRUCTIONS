import pool from "../config/db.js";

const createDocumentsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS documents (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                file_name VARCHAR(255) NOT NULL,
                file_path TEXT NOT NULL,
                file_type VARCHAR(100),
                file_size BIGINT,
                document_type VARCHAR(30) NOT NULL DEFAULT 'OTHER',
                description TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Documents table created successfully.");
    } catch (error) {
        console.error("Documents table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createDocumentsTable();