
const db = require('./db');

const seedProfile = async () => {
    try {
        console.log('Seeding profile settings...');

        // Check if profile exists
        const [existing] = await db.query('SELECT id FROM profile_settings LIMIT 1');

        if (existing.length === 0) {
            await db.query(`
                INSERT INTO profile_settings (
                    hero_title, 
                    hero_subtitle, 
                    hero_name, 
                    hero_bio, 
                    about_intro, 
                    about_description,
                    email,
                    github_url,
                    linkedin_url,
                    twitter_url,
                    footer_copyright
                ) VALUES (
                    'Hello, I am',
                    'Full Stack Developer | UI/UX Enthusiast',
                    'Vikas Jagtap',
                    'I build exceptional digital experiences that are fast, accessible, visually appealing, and responsive.',
                    'Let me introduce myself',
                    'I am a passionate developer with a knack for creating elegant solutions to complex problems. I specialize in modern web technologies and love learning new tools.',
                    'vikas@example.com',
                    'https://github.com',
                    'https://linkedin.com',
                    'https://twitter.com',
                    '© 2026 Vikas Jagtap. All rights reserved.'
                )
            `);
            console.log('Profile settings seeded successfully.');
        } else {
            console.log('Profile settings already exist.');
        }

        process.exit(0);
    } catch (err) {
        console.error('Error seeding profile:', err);
        process.exit(1);
    }
};

seedProfile();
