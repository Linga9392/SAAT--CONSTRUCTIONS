import pool from "../config/db.js";

const createSiteReportsTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS site_reports (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                report_date DATE NOT NULL,
                work_completed TEXT,
                workers_count INTEGER NOT NULL DEFAULT 0,
                materials_used TEXT,
                issues TEXT,
                safety_notes TEXT,
                weather VARCHAR(100),
                supervisor_notes TEXT,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT unique_project_report_date
                    UNIQUE (project_id, report_date)
            );
        `);

        console.log("Site reports table created successfully.");
    } catch (error) {
        console.error("Site reports table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createSiteReportsTable();