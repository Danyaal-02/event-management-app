import dotenv from 'dotenv';
dotenv.config();

import express, { json } from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import eventRoutes from './routes/eventsRoutes.js';
import sessionRoutes from './routes/sessionsRoutes.js';
import weatherRoutes from './routes/weatherRoutes.js';

const app = express();

connectDB()

app.use(cors());
app.use(json());

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/weather', weatherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

export default app;