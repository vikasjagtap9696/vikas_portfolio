const db = require('./db');

async function fillAbout() {
    const aboutData = {
        about_intro: "I'm a passionate Full Stack Developer & UI/UX Designer based in India.",
        about_description: "I have a deep love for creating elegant solutions to complex problems. With over 3 years of experience in the tech industry, I've worked on a diverse range of projects, from small business websites to large-scale enterprise applications. My goal is always to deliver high-quality, performant, and user-centric digital experiences.",
        about_education_primary: "Bachelor of Computer Science - Pune University",
        about_education_secondary: "Advanced Full Stack Web Development - Certification",
        career_goals: JSON.stringify([
            "Mastering Cloud Architecture (AWS/Azure)",
            "Driving Innovation in Open Source Communities",
            "Mentoring Aspiring Developers",
            "Building Scalable AI-Powered Applications"
        ]),
        about_image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072&auto=format&fit=crop",
        what_i_do: JSON.stringify([
            { title: "Frontend Development", tech: "React, Next.js, Tailwind CSS" },
            { title: "Backend Systems", tech: "Node.js, Express, MySQL, PostgreSQL" },
            { title: "UI/UX Design", tech: "Figma, Responsive Design, Motion Graphics" }
        ])
    };

    try {
        const [rows] = await db.query('SELECT id FROM profile_settings LIMIT 1');
        if (rows.length > 0) {
            const id = rows[0].id;
            console.log(`Updating About Me for profile ID: ${id}`);
            await db.query('UPDATE profile_settings SET ? WHERE id = ?', [aboutData, id]);
            console.log('About Me data updated successfully!');
        } else {
            console.log('No profile row found to update. Please run Hero force update first.');
        }
    } catch (err) {
        console.error('Error filling About Me data:', err);
    } finally {
        process.exit();
    }
}

fillAbout();
