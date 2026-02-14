const mysql = require('mysql2/promise');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

async function setupDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            multipleStatements: true
        });

        const schema = fs.readFileSync(path.join(__dirname, 'db_schema.sql'), 'utf8');
        console.log('Running schema...');
        await connection.query(schema);
        console.log('Database schema executed successfully.');
        await connection.end();
    } catch (err) {
        console.error('Error executing schema:', err);
    }
}

setupDatabase();
