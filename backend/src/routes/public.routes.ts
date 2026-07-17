// src/routes/public.routes.ts
import { Router } from 'express';
import { login } from '../controllers/auth.controller';
import { getPublicProfessionals } from '../controllers/professional.controller';
import { validate } from '../middlewares/validate.middleware';
import { loginSchema } from '../validators/auth.validators';
import { loginLimiter } from '../middlewares/rateLimit.middleware';

const router = Router();

// Rutas públicas de la Web de Difusión
router.get('/professionals', getPublicProfessionals); // Sección pública "Profesionales"

// Autenticación para la Intranet
router.post('/auth/login', loginLimiter, validate(loginSchema), login);

export default router;
