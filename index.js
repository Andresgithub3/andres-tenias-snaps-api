const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const photosRoutes = require('./routes/photos');
const tagsRoutes = require('./routes/tags');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Use routes
app.use('/photos', photosRoutes);
app.use('/tags', tagsRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});