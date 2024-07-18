const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const taskRoutes = require('./routes/tasks');

const app = express();
const port = 5000;

// MongoDB connection URI
const uri = 'mongodb://127.0.0.1:27017/todo-app';

// Connect to MongoDB
mongoose.connect(uri).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));


// Use task routes
app.use('/api/tasks', taskRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
