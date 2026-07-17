// src/routes/public.routes.ts
import { Router } from 'express';
import { login, registerProfessional } from '../controllers/auth.controller';
import { getPublicProfessionals } from '../controllers/professional.controller';

const router = Router();

// Rutas públicas de la Web de Difusión
router.get('/professionals', getPublicProfessionals); // Sección pública "Profesionales" 

// Rutas de Autenticación para la Intranet 
router.post('/auth/login', login);
router.post('/auth/register-internal-only', registerProfessional); // Registro de profesionales

export default router;