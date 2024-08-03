import { Router } from 'express';
const router = Router();
import { createEvent, getEvents, updateEvent, deleteEvent, getWeather } from '../controllers/eventsController.js';
import authMiddleware from '../middleware/auth.js';

router.post('/', authMiddleware, createEvent);
router.get('/', authMiddleware, getEvents);
router.put('/:id', authMiddleware, updateEvent);
router.delete('/:id', authMiddleware, deleteEvent);
router.get('/weather/:location', authMiddleware, getWeather);

export default router;
