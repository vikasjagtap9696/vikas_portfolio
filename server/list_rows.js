const db = require('./db');
async function check() {
    try {
        const [rows] = await db.query('SELECT * FROM profile_settings');
        console.log('Rows found:', rows.length);
        rows.forEach((row, i) => {
            console.log(`Row ${i}:`, JSON.stringify(row, null, 2));
        });
    } catch (err) {
        console.error('Error:', err);
    } finally {
        process.exit();
    }
}
check();
