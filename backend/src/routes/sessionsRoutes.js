import { Router } from 'express';
const router = Router();
import { getSessions, getCurrentSession } from '../controllers/sessionsController.js';
import authMiddleware from '../middleware/auth.js';

router.get('/', authMiddleware, getSessions);
router.get('/current', authMiddleware, getCurrentSession);

export default router;
