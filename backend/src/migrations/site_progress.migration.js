import pool from "../config/db.js";

const createSiteProgressTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS site_progress (
                id SERIAL PRIMARY KEY,

                user_id INTEGER NOT NULL
                    REFERENCES users(id)
                    ON DELETE CASCADE,

                project_id INTEGER NOT NULL
                    REFERENCES projects(id)
                    ON DELETE CASCADE,

                progress_date DATE NOT NULL
                    DEFAULT CURRENT_DATE,

                progress_percentage NUMERIC(5,2) NOT NULL
                    CHECK (
                        progress_percentage >= 0
                        AND progress_percentage <= 100
                    ),

                work_completed TEXT NOT NULL,

                work_in_progress TEXT,

                manpower_count INTEGER
                    CHECK (manpower_count >= 0),

                material_status TEXT,

                issues TEXT,

                remarks TEXT,

                created_at TIMESTAMP NOT NULL
                    DEFAULT CURRENT_TIMESTAMP,

                updated_at TIMESTAMP NOT NULL
                    DEFAULT CURRENT_TIMESTAMP
            );
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_site_progress_user_id
            ON site_progress(user_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_site_progress_project_id
            ON site_progress(project_id);
        `);

        await pool.query(`
            CREATE INDEX IF NOT EXISTS
            idx_site_progress_date
            ON site_progress(progress_date);
        `);

        console.log(
            "Site progress table created successfully."
        );
    } catch (error) {
        console.error(
            "Site progress table creation failed:",
            error.message
        );
    } finally {
        await pool.end();
    }
};

createSiteProgressTable();