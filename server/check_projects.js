
const db = require('./db');
async function check() {
    try {
        const [rows] = await db.query('SELECT COUNT(*) as count FROM projects');
        console.log('Projects count:', rows[0].count);
        const [all] = await db.query('SELECT * FROM projects');
        console.log('Projects:', JSON.stringify(all, null, 2));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
