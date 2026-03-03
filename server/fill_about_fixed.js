const db = require('./db');

async function fillAboutFixed() {
    const aboutData = {
        about_intro: "I'm a passionate Full Stack Developer & UI/UX Designer based in India.",
        about_description: "I have a deep love for creating elegant solutions to complex problems. With over 3 years of experience in the tech industry, I've worked on a diverse range of projects. My goal is always to deliver high-quality, performant, and user-centric digital experiences.",
        // Correct format with pipe for About.tsx parsing
        about_education_primary: "Bachelor of Computer Science | Pune University",
        about_education_secondary: "Advanced Full Stack Web Dev | Certification Course",
        career_goals: JSON.stringify([
            "Mastering Cloud Architecture",
            "Driving Innovation in Open Source",
            "Mentoring Aspiring Developers",
            "Building Scalable AI Apps"
        ]),
        about_image_url: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2072",
        what_i_do: JSON.stringify([
            { title: "Frontend", tech: "React, Next.js, Tailwind" },
            { title: "Backend", tech: "Node.js, Express, MySQL" },
            { title: "Design", tech: "Figma, UI/UX, Motion" }
        ])
    };

    try {
        const [rows] = await db.query('SELECT id FROM profile_settings LIMIT 1');
        const id = rows[0].id;
        console.log(`Updating Fixed About Me for profile ID: ${id}`);
        await db.query('UPDATE profile_settings SET ? WHERE id = ?', [aboutData, id]);
        console.log('Fixed About Me data restored!');
    } catch (err) {
        console.error('Update failed:', err);
    } finally {
        process.exit();
    }
}

fillAboutFixed();
