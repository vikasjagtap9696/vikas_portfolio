const { Sequelize, DataTypes } = require('sequelize');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const databaseUrl = process.env.DATABASE_URL;
const sequelize = databaseUrl
    ? new Sequelize(databaseUrl, {
        dialect: 'postgres',
        dialectOptions: databaseUrl.includes('sslmode=require')
            ? { ssl: { require: true, rejectUnauthorized: false } }
            : {},
        logging: false,
    })
    : new Sequelize(
        process.env.DB_NAME || 'vikas_portfolio',
        process.env.DB_USER || 'postgres',
        process.env.DB_PASSWORD || 'postgres',
        {
            host: process.env.DB_HOST || 'localhost',
            port: Number(process.env.DB_PORT || 5432),
            dialect: 'postgres',
            logging: false,
        }
    );

const User = sequelize.define('User', {
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password_hash: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'user'), defaultValue: 'user' }
}, { tableName: 'users', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Project = sequelize.define('Project', {
    title: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    image_url: DataTypes.STRING,
    live_url: DataTypes.STRING,
    github_url: DataTypes.STRING,
    tech_stack: DataTypes.JSONB,
    featured: { type: DataTypes.BOOLEAN, defaultValue: false },
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'projects', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const Skill = sequelize.define('Skill', {
    name: { type: DataTypes.STRING, allowNull: false },
    proficiency: {
        type: DataTypes.INTEGER,
        validate: { min: 0, max: 100 }
    },
    category: { type: DataTypes.STRING, allowNull: false },
    icon: DataTypes.STRING,
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'skills', timestamps: true, createdAt: 'created_at', updatedAt: false });

const ContactSubmission = sequelize.define('ContactSubmission', {
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    subject: DataTypes.STRING,
    message: { type: DataTypes.TEXT, allowNull: false },
    is_read: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'contact_submissions', timestamps: true, createdAt: 'created_at', updatedAt: false });

const Experience = sequelize.define('Experience', {
    company: { type: DataTypes.STRING, allowNull: false },
    title: { type: DataTypes.STRING, allowNull: false },
    location: DataTypes.STRING,
    period: DataTypes.STRING,
    description: DataTypes.JSONB,
    technologies: DataTypes.JSONB,
    is_current: { type: DataTypes.BOOLEAN, defaultValue: false },
    type: DataTypes.STRING,
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'experiences', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const ProfileSetting = sequelize.define('ProfileSetting', {
    hero_title: DataTypes.STRING,
    hero_subtitle: DataTypes.STRING,
    hero_name: { type: DataTypes.STRING, defaultValue: 'Vikas Jagtap' },
    hero_bio: DataTypes.TEXT,
    about_intro: DataTypes.TEXT,
    about_description: DataTypes.TEXT,
    avatar_url: DataTypes.STRING,
    resume_url: DataTypes.STRING,
    github_url: DataTypes.STRING,
    linkedin_url: DataTypes.STRING,
    twitter_url: DataTypes.STRING,
    email: DataTypes.STRING,
    footer_copyright: DataTypes.STRING,
    about_education_primary: DataTypes.STRING,
    about_education_secondary: DataTypes.STRING,
    career_goals: DataTypes.JSONB,
    hero_background_url: DataTypes.STRING,
    about_image_url: DataTypes.STRING,
    stat_years_experience: DataTypes.STRING,
    stat_projects_completed: DataTypes.STRING,
    stat_technologies: DataTypes.STRING,
    stat_client_satisfaction: DataTypes.STRING,
    footer_tagline: DataTypes.STRING,
    footer_location: DataTypes.STRING,
    what_i_do: DataTypes.JSONB
}, { tableName: 'profile_settings', timestamps: true, createdAt: 'created_at', updatedAt: 'updated_at' });

const Certificate = sequelize.define('Certificate', {
    title: { type: DataTypes.STRING, allowNull: false },
    issuer: { type: DataTypes.STRING, allowNull: false },
    issue_date: DataTypes.DATEONLY,
    credential_url: DataTypes.STRING,
    image_url: DataTypes.STRING,
    display_order: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'certificates', timestamps: true, createdAt: 'created_at', updatedAt: false });

const NotificationSetting = sequelize.define('NotificationSetting', {
    notification_email: DataTypes.STRING,
    send_confirmation_email: { type: DataTypes.BOOLEAN, defaultValue: false }
}, { tableName: 'notification_settings', timestamps: false });

const ResumeSetting = sequelize.define('ResumeSetting', {
    file_url: DataTypes.STRING,
    file_name: DataTypes.STRING
}, { tableName: 'resume_settings', timestamps: true, createdAt: false, updatedAt: 'updated_at' });

module.exports = {
    sequelize,
    User,
    Project,
    Skill,
    ContactSubmission,
    Experience,
    ProfileSetting,
    Certificate,
    NotificationSetting,
    ResumeSetting
};
