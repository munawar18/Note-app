import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Routes
import authRoutes from './routes/auth.routes';
import notesRoutes from './routes/notes.routes';

app.use('/api/auth', authRoutes);
app.use('/api/notes', notesRoutes);
// Serve static files from the 'uploads' folder
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

mongoose.connect(process.env.MONGO_URI!)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(4000, () => console.log('Server running on port 4000'));
  })
  .catch(err => console.error(err));
