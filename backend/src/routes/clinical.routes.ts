// src/routes/clinical.routes.ts
import { Router } from 'express';
import { requireAuth } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import { getPatients, getPatientClinicalFile, createClinicalReport, updateClinicalReport } from '../controllers/patient.controller';
import { createReportSchema, updateReportSchema } from '../validators/report.validators';

const router = Router();

// Aplicar el middleware de autenticación institucional a todas las rutas clínicas
router.use(requireAuth);

// Listado de pacientes
router.get('/patients', getPatients);

// Información del paciente, su ficha (encuesta prellenada) y su historial clínico
router.get('/patients/:id/file', getPatientClinicalFile);

// Crear/Enviar reporte clínico (solo profesionales)
router.post('/reports', validate(createReportSchema), createClinicalReport);

// Editar reporte clínico (autor o admin)
router.put('/reports/:id', validate(updateReportSchema), updateClinicalReport);

export default router;
