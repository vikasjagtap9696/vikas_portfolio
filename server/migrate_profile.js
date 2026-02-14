const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrateProfile() {
    console.log('Starting profile migration...');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    const columnsToAdd = [
        "about_education_primary VARCHAR(255)",
        "about_education_secondary VARCHAR(255)",
        "career_goals JSON",
        "hero_background_url VARCHAR(255)",
        "about_image_url VARCHAR(255)",
        "stat_years_experience VARCHAR(50)",
        "stat_projects_completed VARCHAR(50)",
        "stat_technologies VARCHAR(50)",
        "stat_client_satisfaction VARCHAR(50)",
        "footer_tagline VARCHAR(255)",
        "footer_location VARCHAR(255)"
    ];

    try {
        for (const colDef of columnsToAdd) {
            try {
                // Try to add the column without IF NOT EXISTS (for compatibility)
                await connection.query(`ALTER TABLE profile_settings ADD COLUMN ${colDef}`);
                console.log(`Added column: ${colDef}`);
            } catch (e) {
                // Error 1060: Duplicate column name
                if (e.errno === 1060) {
                    console.log(`Column already exists (skipped): ${colDef}`);
                } else {
                    console.error(`Failed to add column ${colDef}: ${e.message}`);
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
