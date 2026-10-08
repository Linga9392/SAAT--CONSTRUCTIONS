import pool from "../config/db.js";

const createUsersTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                full_name VARCHAR(150) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                phone VARCHAR(20),
                role VARCHAR(30) NOT NULL DEFAULT 'USER',
                status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log("Users table created successfully.");
    } catch (error) {
        console.error("Users table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createUsersTable();