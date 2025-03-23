import 'dotenv/config'; 
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import photosRoutes from './routes/photos.js';
import tagsRoutes from './routes/tags.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/images', express.static(join(__dirname, 'public/images')));

// Use routes
app.use('/photos', photosRoutes);
app.use('/tags', tagsRoutes);

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});