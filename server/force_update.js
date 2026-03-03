const db = require('./db');

async function update() {
    const data = {
        hero_name: 'Vikas Jagtap',
        hero_title: 'Full Stack Developer',
        hero_subtitle: 'Creating Elegant Digital Solutions',
        hero_bio: 'Passionate developer crafting beautiful, responsive web applications with modern technologies. Turning ideas into elegant digital experiences.',
        stat_years_experience: '3+',
        stat_projects_completed: '50+',
        stat_technologies: '15+',
        stat_client_satisfaction: '100%',
        github_url: 'https://github.com/vikasjagtap9696',
        linkedin_url: 'https://linkedin.com/in/vikasjagtap',
        twitter_url: 'https://twitter.com/vikasjagtap',
        email: 'vikas@example.com'
    };

    try {
        // First, find the row ID
        const [rows] = await db.query('SELECT id FROM profile_settings LIMIT 1');
        if (rows.length === 0) {
            console.log('No profile row found, inserting new one...');
            await db.query('INSERT INTO profile_settings SET ?', data);
        } else {
            const id = rows[0].id;
            console.log(`Updating profile ID: ${id}`);
            await db.query('UPDATE profile_settings SET ? WHERE id = ?', [data, id]);
        }
        console.log('Profile updated successfully with data:', data);

        // Final check
        const [final] = await db.query('SELECT * FROM profile_settings LIMIT 1');
        console.log('Final Data in DB:', JSON.stringify(final[0], null, 2));

    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        process.exit();
    }
}

update();
