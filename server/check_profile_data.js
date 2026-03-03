const db = require('./db');
async function check() {
    try {
        const [rows] = await db.query('SELECT * FROM profile_settings');
        console.log('Profile settings row count:', rows.length);
        if (rows.length > 0) {
            console.log('First row:', JSON.stringify(rows[0], null, 2));
        } else {
            console.log('No data found in profile_settings table.');
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}
check();
