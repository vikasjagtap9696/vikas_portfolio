
const db = require('./db');
async function check() {
    try {
        const [all] = await db.query('SELECT * FROM projects');
        all.forEach(p => {
            console.log(`ID: ${p.id}, Title: ${p.title}, Featured: ${p.featured}`);
        });
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}
check();
