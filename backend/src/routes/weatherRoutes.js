import { Router } from 'express';
const router = Router();
import { getWeather } from '../controllers/weatherController.js';

router.get('/:location', getWeather);

export default router;
