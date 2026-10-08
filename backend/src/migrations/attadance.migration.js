import pool from "../config/db.js";

const createAttendanceTable = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS attendance (
                id SERIAL PRIMARY KEY,
                user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
                project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
                member_id INTEGER NOT NULL REFERENCES members(id) ON DELETE CASCADE,
                attendance_date DATE NOT NULL,
                status VARCHAR(20) NOT NULL DEFAULT 'PRESENT',
                overtime_hours NUMERIC(5, 2) NOT NULL DEFAULT 0,
                wage_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
                created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT unique_member_attendance
                    UNIQUE (member_id, attendance_date)
            );
        `);

        console.log("Attendance table created successfully.");
    } catch (error) {
        console.error("Attendance table creation failed:", error.message);
    } finally {
        await pool.end();
    }
};

createAttendanceTable();