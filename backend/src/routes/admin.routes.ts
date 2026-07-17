// src/routes/admin.routes.ts
import { Router } from 'express';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validate.middleware';
import {
  listProfessionals,
  createProfessional,
  updateProfessional,
  deleteProfessional,
  createPatient,
  updatePatient,
  deletePatient,
  deleteReport,
} from '../controllers/admin.controller';
import { createProfessionalSchema, updateProfessionalSchema } from '../validators/professional.validators';
import { createPatientSchema, updatePatientSchema } from '../validators/patient.validators';

const router = Router();

// Todas las rutas de este archivo son exclusivas de Administrador
router.use(requireAuth, requireRole('admin'));

// Profesionales
router.get('/admin/professionals', listProfessionals);
router.post('/admin/professionals', validate(createProfessionalSchema), createProfessional);
router.put('/admin/professionals/:id', validate(updateProfessionalSchema), updateProfessional);
router.delete('/admin/professionals/:id', deleteProfessional);

// Pacientes
router.post('/admin/patients', validate(createPatientSchema), createPatient);
router.put('/admin/patients/:id', validate(updatePatientSchema), updatePatient);
router.delete('/admin/patients/:id', deletePatient);

// Informes clínicos
router.delete('/admin/reports/:id', deleteReport);

export default router;
