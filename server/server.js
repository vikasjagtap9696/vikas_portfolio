const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Multer for file uploads (basic setup)
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Test route
app.get('/', (req, res) => {
    res.send('Welcome to Vikas Portfolio API');
});

// Import Routes
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const skillRoutes = require('./routes/skills');
const contactRoutes = require('./routes/contact');
const profileRoutes = require('./routes/profile');
const experienceRoutes = require('./routes/experience');
const certificateRoutes = require('./routes/certificates');
const uploadRoutes = require('./routes/upload');
const notificationRoutes = require('./routes/notifications');
const resumeRoutes = require('./routes/resume');
const chatRoutes = require('./routes/chat');
const path = require('path');

// Use Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/experience', experienceRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/chat', chatRoutes);

// make sure to serve uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
