// src/controllers/professional.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../db';

export const getPublicProfessionals = async (req: Request, res: Response): Promise<void> => {
  try {
    const professionals = await prisma.professional.findMany({
      select: {
        id: true,
        name: true,
        specialty: true,
        imageUrl: true, // URL de la foto para el sitio web [cite: 35]
      }
    });
    res.json(professionals);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener la lista de profesionales', error: error.message });
  }
};