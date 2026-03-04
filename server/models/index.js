const { Sequelize, DataTypes } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
    process.env.DB_NAME || 'vikas_portfolio',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || 'root',
    {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false, // set to console.log to see queries
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
    tech_stack: DataTypes.JSON,
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
    description: DataTypes.JSON,
    technologies: DataTypes.JSON,
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
    footer_copyright: DataTypes.STRING
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
