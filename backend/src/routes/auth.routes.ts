// src/routes/auth.routes.ts
import { Router } from 'express';
import { logout, getMe } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.post('/auth/logout', logout);
router.get('/auth/me', getMe);

export default router;
