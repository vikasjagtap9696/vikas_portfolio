const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
require('dotenv').config();

async function createAdmin() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT
    });

    try {
        const email = 'admin@example.com';
        const password = 'admin123';
        const hashedPassword = await bcrypt.hash(password, 10);

        const [existing] = await connection.query('SELECT * FROM users WHERE email = ?', [email]);

        if (existing.length > 0) {
            console.log('Updating existing admin user...');
            await connection.query('UPDATE users SET password_hash = ? WHERE email = ?', [hashedPassword, email]);
        } else {
            console.log('Creating new admin user...');
            await connection.query('INSERT INTO users (email, password_hash, role) VALUES (?, ?, ?)', [email, hashedPassword, 'admin']);
        }

        console.log(`Admin user '${email}' set with password '${password}'`);

    } catch (err) {
        console.error('Error creating admin:', err);
    } finally {
        await connection.end();
    }
}

createAdmin();
