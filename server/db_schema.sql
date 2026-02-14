-- Database: vikas_portfolio

CREATE DATABASE IF NOT EXISTS vikas_portfolio;
USE vikas_portfolio;

-- Users Table (for Admin login)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url VARCHAR(255),
    live_url VARCHAR(255),
    github_url VARCHAR(255),
    tech_stack JSON, -- Store array of technologies as JSON
    featured BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Skills Table
CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    proficiency INT CHECK (proficiency >= 0 AND proficiency <= 100),
    category VARCHAR(50) NOT NULL, -- e.g., 'Frontend', 'Backend'
    icon VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Submissions Table
CREATE TABLE IF NOT EXISTS contact_submissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Experiences Table
CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    period VARCHAR(100), -- e.g., "Jan 2020 - Present"
    description JSON, -- Array of bullet points
    technologies JSON, -- Array of tech used
    is_current BOOLEAN DEFAULT FALSE,
    type VARCHAR(50), -- e.g., 'Full-time', 'Freelance'
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Profile Settings Table (Single row expected)
CREATE TABLE IF NOT EXISTS profile_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hero_title VARCHAR(255),
    hero_subtitle VARCHAR(255),
    hero_name VARCHAR(100),
    hero_bio TEXT,
    about_intro TEXT,
    about_description TEXT,
    avatar_url VARCHAR(255),
    resume_url VARCHAR(255),
    github_url VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    email VARCHAR(255),
    footer_copyright VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Certificates Table
CREATE TABLE IF NOT EXISTS certificates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE,
    credential_url VARCHAR(255),
    image_url VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert Default Admin User (password: 'admin123')
INSERT INTO users (email, password_hash, role) 
VALUES ('admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin')
ON DUPLICATE KEY UPDATE email=email;
