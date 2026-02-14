const mysql = require('mysql2/promise');
require('dotenv').config();

async function seedData() {
    console.log('Starting data seeding...');

    const connection = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        multipleStatements: true
    });

    try {
        // Clear existing data (optional, but good for idempotency)
        // await connection.query('TRUNCATE TABLE projects');
        // await connection.query('TRUNCATE TABLE skills');
        // await connection.query('TRUNCATE TABLE experiences');
        // await connection.query('TRUNCATE TABLE certificates');
        // await connection.query('TRUNCATE TABLE profile_settings');

        // 1. Profile Settings
        console.log('Seeding Profile Settings...');
        await connection.query('TRUNCATE TABLE profile_settings');

        // Removed check since we truncate above
        if (true) {
            await connection.query(`
                INSERT INTO profile_settings (
                    hero_title, hero_subtitle, hero_name, hero_bio, 
                    about_intro, about_description, 
                    avatar_url, resume_url, 
                    github_url, linkedin_url, twitter_url, email, footer_copyright,
                    about_education_primary, about_education_secondary, career_goals,
                    hero_background_url, about_image_url,
                    stat_years_experience, stat_projects_completed, stat_technologies, stat_client_satisfaction,
                    footer_tagline, footer_location
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                "Software Engineer",
                "Building Scalable Solutions",
                "Vikas Jagtap",
                "Passionate about creating efficient and robust backend systems.",
                "Hello, I'm Vikas.",
                "I specialize in full-stack development with a focus on Node.js and React.",
                "https://github.com/shadcn.png",
                "https://example.com/resume.pdf",
                "https://github.com/vikasjagtap",
                "https://linkedin.com/in/vikasjagtap",
                "https://twitter.com/vikasjagtap",
                "vikas@example.com",
                "© 2024 Vikas Jagtap. All rights reserved.",
                "B.Tech in Computer Science | University of Tech, 2018-2022",
                "Certified MERN Stack Developer | Coding Bootcamp, 2022",
                JSON.stringify(["Master Cloud Architecture", "Contribute to Open Source", "Build a SaaS Product"]),
                "https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=1600&h=900&fit=crop",
                "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop",
                "5+", "50+", "20+", "100%",
                "Building the future, one line of code at a time.",
                "Pune, India"
            ]);
        }

        // 2. Projects
        console.log('Seeding Projects...');
        const projectsData = [
            {
                title: "Portfolio Website",
                description: "A personal portfolio website built with React and Node.js.",
                image_url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
                live_url: "https://vikas-portfolio.com",
                github_url: "https://github.com/vikasjagtap/portfolio",
                tech_stack: JSON.stringify(["React", "Node.js", "MySQL", "Tailwind CSS"]),
                featured: true
            },
            {
                title: "E-commerce API",
                description: "RESTful API for an e-commerce platform with authentication and payment integration.",
                image_url: "https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?w=600&h=400&fit=crop",
                live_url: null,
                github_url: "https://github.com/vikasjagtap/ecommerce-api",
                tech_stack: JSON.stringify(["Express.js", "MongoDB", "Stripe", "JWT"]),
                featured: true
            },
            {
                title: "Task Manager",
                description: "A collaborative task management tool for teams.",
                image_url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=600&h=400&fit=crop",
                live_url: "https://taskmanager.app",
                github_url: "https://github.com/vikasjagtap/task-manager",
                tech_stack: JSON.stringify(["Vue.js", "Firebase", "Vuex"]),
                featured: false
            }
        ];

        for (const proj of projectsData) {
            // Check if exists to avoid duplicates on re-run
            const [existing] = await connection.query('SELECT id FROM projects WHERE title = ?', [proj.title]);
            if (existing.length === 0) {
                await connection.query(`
                    INSERT INTO projects (title, description, image_url, live_url, github_url, tech_stack, featured)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `, [proj.title, proj.description, proj.image_url, proj.live_url, proj.github_url, proj.tech_stack, proj.featured]);
            }
        }

        // 3. Skills
        console.log('Seeding Skills...');
        const skillsData = [
            { name: "JavaScript", proficiency: 90, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
            { name: "React", proficiency: 85, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
            { name: "Node.js", proficiency: 80, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" },
            { name: "MySQL", proficiency: 75, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg" },
            { name: "Python", proficiency: 70, category: "Backend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
            { name: "CSS3", proficiency: 85, category: "Frontend", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
            { name: "Git", proficiency: 90, category: "Tools", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" },
            { name: "Docker", proficiency: 60, category: "DevOps", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" }
        ];

        for (const skill of skillsData) {
            const [existing] = await connection.query('SELECT id FROM skills WHERE name = ?', [skill.name]);
            if (existing.length === 0) {
                await connection.query(`
                    INSERT INTO skills (name, proficiency, category, icon)
                    VALUES (?, ?, ?, ?)
                `, [skill.name, skill.proficiency, skill.category, skill.icon]);
            }
        }

        // 4. Experiences
        console.log('Seeding Experiences...');
        const experiencesData = [
            {
                company: "Tech Solutions Inc.",
                title: "Senior Full Stack Developer",
                location: "New York, NY",
                period: "Jan 2022 - Present",
                description: JSON.stringify(["Lead a team of 5 developers.", "Architected scalable microservices.", "Reduced server costs by 30%."]),
                technologies: JSON.stringify(["React", "Node.js", "AWS"]),
                is_current: true,
                type: "Full-time"
            },
            {
                company: "Web Innovators",
                title: "Frontend Developer",
                location: "San Francisco, CA",
                period: "Jun 2019 - Dec 2021",
                description: JSON.stringify(["Developed responsive UI components.", "Optimized frontend performance.", "Collaborated with UX designers."]),
                technologies: JSON.stringify(["Vue.js", "Sass", "Webpack"]),
                is_current: false,
                type: "Full-time"
            }
        ];

        for (const exp of experiencesData) {
            const [existing] = await connection.query('SELECT id FROM experiences WHERE company = ? AND title = ?', [exp.company, exp.title]);
            if (existing.length === 0) {
                await connection.query(`
                    INSERT INTO experiences (company, title, location, period, description, technologies, is_current, type)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `, [exp.company, exp.title, exp.location, exp.period, exp.description, exp.technologies, exp.is_current, exp.type]);
            }
        }

        // 5. Certificates
        console.log('Seeding Certificates...');
        const certificatesData = [
            {
                title: "AWS Certified Solutions Architect",
                issuer: "Amazon Web Services",
                issue_date: "2023-05-15",
                credential_url: "https://aws.amazon.com/certification/",
                image_url: "https://d1.awsstatic.com/training-and-certification/certification-badges/AWS-Certified-Solutions-Architect-Associate_badge.3419559c682629072f1eb969d59ed66.png"
            },
            {
                title: "Meta Frontend Developer Professional Certificate",
                issuer: "Coursera",
                issue_date: "2022-11-20",
                credential_url: "https://www.coursera.org",
                image_url: null
            }
        ];

        for (const cert of certificatesData) {
            const [existing] = await connection.query('SELECT id FROM certificates WHERE title = ?', [cert.title]);
            if (existing.length === 0) {
                await connection.query(`
                    INSERT INTO certificates (title, issuer, issue_date, credential_url, image_url)
                    VALUES (?, ?, ?, ?, ?)
                `, [cert.title, cert.issuer, cert.issue_date, cert.credential_url, cert.image_url]);
            }
        }

        console.log('Seeding completed successfully!');

    } catch (err) {
        console.error('Error seeding data:', err);
    } finally {
        await connection.end();
    }
}

seedData();
