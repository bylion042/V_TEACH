require('dotenv').config(); // Load .env variables
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Separate auth routes file

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files
app.set('view engine', 'ejs');

// Log MongoDB URI (for debugging)
console.log('Mongo URI:', process.env.MONGODB_URI); 

// Connect to MongoDB

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Session management
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Use auth routes for handling sign-up and login
app.use(authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
