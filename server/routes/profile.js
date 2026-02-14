const express = require('express');
const router = express.Router();
const db = require('../db');

// Get profile settings
router.get('/', async (req, res) => {
    try {
        const [profiles] = await db.query('SELECT * FROM profile_settings LIMIT 1');
        res.json(profiles[0] || {});
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update profile (upsert mostly)
router.put('/', async (req, res) => {
    try {
        const {
            hero_title, hero_subtitle, hero_name, hero_bio,
            about_intro, about_description, avatar_url,
            github_url, linkedin_url, twitter_url, email, footer_copyright,
            about_education_primary, about_education_secondary, career_goals,
            hero_background_url, about_image_url,
            stat_years_experience, stat_projects_completed, stat_technologies, stat_client_satisfaction,
            footer_tagline, footer_location
        } = req.body;

        // Check if exists
        const [existing] = await db.query('SELECT id FROM profile_settings LIMIT 1');

        if (existing.length > 0) {
            await db.query(
                `UPDATE profile_settings SET 
                 hero_title=?, hero_subtitle=?, hero_name=?, hero_bio=?, 
                 about_intro=?, about_description=?, avatar_url=?, 
                 github_url=?, linkedin_url=?, twitter_url=?, email=?, footer_copyright=?,
                 about_education_primary=?, about_education_secondary=?, career_goals=?,
                 hero_background_url=?, about_image_url=?,
                 stat_years_experience=?, stat_projects_completed=?, stat_technologies=?, stat_client_satisfaction=?,
                 footer_tagline=?, footer_location=?
                 WHERE id=?`,
                [hero_title, hero_subtitle, hero_name, hero_bio,
                    about_intro, about_description, avatar_url,
                    github_url, linkedin_url, twitter_url, email, footer_copyright,
                    about_education_primary, about_education_secondary, JSON.stringify(career_goals || []),
                    hero_background_url, about_image_url,
                    stat_years_experience, stat_projects_completed, stat_technologies, stat_client_satisfaction,
                    footer_tagline, footer_location,
                    existing[0].id]
            );
        } else {
            await db.query(
                `INSERT INTO profile_settings 
                (hero_title, hero_subtitle, hero_name, hero_bio, 
                 about_intro, about_description, avatar_url, 
                 github_url, linkedin_url, twitter_url, email, footer_copyright,
                 about_education_primary, about_education_secondary, career_goals,
                 hero_background_url, about_image_url,
                 stat_years_experience, stat_projects_completed, stat_technologies, stat_client_satisfaction,
                 footer_tagline, footer_location) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [hero_title, hero_subtitle, hero_name, hero_bio,
                    about_intro, about_description, avatar_url,
                    github_url, linkedin_url, twitter_url, email, footer_copyright,
                    about_education_primary, about_education_secondary, JSON.stringify(career_goals || []),
                    hero_background_url, about_image_url,
                    stat_years_experience, stat_projects_completed, stat_technologies, stat_client_satisfaction,
                    footer_tagline, footer_location]
            );
        }
        res.json({ message: 'Profile updated' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
