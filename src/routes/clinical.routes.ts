// src/routes/clinical.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { getPatients, getPatientClinicalFile, createClinicalReport } from '../controllers/patient.controller';

const router = Router();

// Aplicar el middleware de autenticación institucional a todas las rutas clínicas 
router.use(requireAuth);

// Listado de clientes del profesional 
router.get('/patients', getPatients);

// Información del paciente, su ficha (encuesta prellenada) y su historial clínico 
router.get('/patients/:id/file', getPatientClinicalFile);

// Crear/Enviar reporte clínico 
router.post('/reports', createClinicalReport);

export default router;