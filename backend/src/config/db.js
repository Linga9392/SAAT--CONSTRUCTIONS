import pg from "pg";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

const { Pool } = pg;

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

pool.connect()
    .then((client) => {
        logger.info(
            "PostgreSQL 18 Database Connected Successfully"
        );
        client.release();
    })
    .catch((err) => {
        logger.error(
            `Database Connection Error: ${err.message}`
        );
    });

export default pool;