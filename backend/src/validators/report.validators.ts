import { z } from 'zod';

export const createReportSchema = z.object({
  patientId: z.coerce.number().int().positive('Paciente inválido.'),
  therapeuticGoal: z.string().min(1, 'El objetivo terapéutico es obligatorio.'),
  activityPerformed: z.string().min(1, 'La actividad realizada es obligatoria.'),
  goalsAchieved: z.string().min(1, 'El cumplimiento de logros es obligatorio.'),
  clinicalObservations: z.string().min(1, 'Las observaciones clínicas son obligatorias.'),
  behaviorObservation: z.string().min(1, 'La observación de trato/conducta es obligatoria.'),
  additionalComments: z.string().optional().or(z.literal('')),
});

export const updateReportSchema = z.object({
  therapeuticGoal: z.string().min(1).optional(),
  activityPerformed: z.string().min(1).optional(),
  goalsAchieved: z.string().min(1).optional(),
  clinicalObservations: z.string().min(1).optional(),
  behaviorObservation: z.string().min(1).optional(),
  additionalComments: z.string().optional().or(z.literal('')),
});
