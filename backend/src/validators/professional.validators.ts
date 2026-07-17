import { z } from 'zod';

const institutionalEmail = z
  .string()
  .email('Correo inválido.')
  .refine((email) => email.endsWith('@interterapia.cl'), {
    message: 'El correo debe pertenecer al dominio institucional (@interterapia.cl).',
  });

export const createProfessionalSchema = z.object({
  name: z.string().min(1, 'El nombre es obligatorio.'),
  email: institutionalEmail,
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
  specialty: z.string().min(1, 'La especialidad es obligatoria.'),
  imageUrl: z.string().url('URL de imagen inválida.').optional().or(z.literal('')),
});

export const updateProfessionalSchema = z.object({
  name: z.string().min(1).optional(),
  email: institutionalEmail.optional(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.').optional(),
  specialty: z.string().min(1).optional(),
  imageUrl: z.string().url('URL de imagen inválida.').optional().or(z.literal('')),
});
