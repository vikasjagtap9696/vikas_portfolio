const mysql = require('mysql2');

const db = mysql.createPool(process.env.MYSQL_URL);

db.getConnection((err, connection) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
        connection.release();
    }
});

module.exports = db.promise();