const express = require('express');
const cors = require('cors');
const { sequelize, User } = require('./models');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Detailed Request logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    if (req.method !== 'GET') {
        console.log('Body keys:', Object.keys(req.body));
    }
    next();
});

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

sequelize.sync().then(async () => {
    console.log('Database synced successfully with Sequelize.');

    // Ensure Admin User Exists for Production (Railway)
    try {
        const adminEmail = 'vikasjagtap.9996@gmail.com';
        const hashedPassword = await bcrypt.hash('@Vikas123', 10);

        const [user, created] = await User.findOrCreate({
            where: { email: adminEmail },
            defaults: {
                password_hash: hashedPassword,
                role: 'admin'
            }
        });

        if (!created) {
            // Update password if user already exists to match requested credentials
            user.password_hash = hashedPassword;
            await user.save();
            console.log('Admin user credentials updated.');
        } else {
            console.log('Admin user created successfully.');
        }
    } catch (adminErr) {
        console.error('Error ensuring admin user:', adminErr);
    }

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Failed to sync database:', err);
});
