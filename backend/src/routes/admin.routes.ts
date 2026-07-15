import { Router } from 'express';
import { createProfessional, deleteProfessional } from '../controllers/admin.controller';
import { authenticateJWT, requireAdmin } from '../middlewares/auth.middleware';

const router = Router();

// Todas estas rutas requieren estar logueado como Superusuario (Admin)
router.post('/professionals', authenticateJWT, requireAdmin, createProfessional);
router.delete('/professionals/:id', authenticateJWT, requireAdmin, deleteProfessional);

export default router;