require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB, initializeDatabase, sequelize } = require('./config/database');
const apiRoutes = require('./routes/api');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const delay = require('./middleware/delay');
const auth = require('./middleware/auth');

// Apply delay middleware to all requests (for testing frontend loading state)
app.use(delay);

// Apply auth middleware to all /api routes
app.use('/api', auth, apiRoutes);

const port = process.env.PORT || 8080;

const startServer = async () => {
    try {
        // Initialize DB (create if not exists)
        await initializeDatabase();
        
        // Connect and sync Sequelize
        await connectDB();
        await sequelize.sync({ alter: true }); // Sync models to DB (create tables)
        
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
    }
};

startServer();
