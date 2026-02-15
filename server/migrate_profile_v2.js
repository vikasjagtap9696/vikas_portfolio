const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateProfile() {
    console.log('Starting profile migration (adding what_i_do)...');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const columns = [
            "what_i_do JSON"
        ];

        for (const col of columns) {
            try {
                await connection.query(`ALTER TABLE profile_settings ADD COLUMN ${col}`);
                console.log(`Executed: ${col}`);
            } catch (e) {
                // Ignore "generic duplicate column" error code 1060
                if (e.errno === 1060) {
                    console.log(`Skipped (already exists): ${col}`);
                } else {
                    console.error(`Error executing ${col}:`, e.message);
                }
            }
        }

        console.log('Migration completed.');

    } catch (err) {
        console.error('Migration error:', err);
    } finally {
        await connection.end();
    }
}

migrateProfile();
