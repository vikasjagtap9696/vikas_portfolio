
const db = require('./db');

const createTables = async () => {
    try {
        console.log('Creating missing tables...');

        // RAM: Resume Settings
        await db.query(`
            CREATE TABLE IF NOT EXISTS resume_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                file_url VARCHAR(255),
                file_name VARCHAR(255),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Created resume_settings table');

        // RAM: Notification Settings
        await db.query(`
            CREATE TABLE IF NOT EXISTS notification_settings (
                id INT AUTO_INCREMENT PRIMARY KEY,
                notification_email VARCHAR(255),
                send_confirmation_email BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Created notification_settings table');

        console.log('All missing tables created successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Error creating tables:', err);
        process.exit(1);
    }
};

createTables();
