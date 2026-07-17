import { z } from 'zod';

export const createPatientSchema = z.object({
  fullName: z.string().min(1, 'El nombre completo es obligatorio.'),
  rut: z.string().min(1, 'El RUT es obligatorio.'),
  age: z.coerce.number().int().min(0, 'La edad debe ser un número válido.'),
  contactPhone: z.string().optional().or(z.literal('')),
  guardianName: z.string().optional().or(z.literal('')),
  initialSurveyData: z.unknown().optional(),
});

export const updatePatientSchema = z.object({
  fullName: z.string().min(1).optional(),
  rut: z.string().min(1).optional(),
  age: z.coerce.number().int().min(0).optional(),
  contactPhone: z.string().optional().or(z.literal('')),
  guardianName: z.string().optional().or(z.literal('')),
  initialSurveyData: z.unknown().optional(),
});
