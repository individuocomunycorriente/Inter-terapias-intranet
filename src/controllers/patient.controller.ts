// src/controllers/patient.controller.ts
import { Response } from 'express';
import { prisma } from '../db';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

// 1. Obtener listado de todos los pacientes para la selección 
export const getPatients = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        fullName: true,
        rut: true,
        age: true
      },
      orderBy: { fullName: 'asc' }
    });
    res.json(patients);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al obtener los pacientes', error: error.message });
  }
};

// 2. Obtener la ficha clínica prellenada y el historial clínico completo del paciente 
export const getPatientClinicalFile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const idStr = Array.isArray(id) ? id[0] : id;

    const patientId = parseInt(idStr, 10);

    if (isNaN(patientId)) {
      res.status(400).json({ message: 'ID de paciente inválido.' });
      return;
    }

    const patientFile = await prisma.patient.findUnique({
      where: { id: patientId },
      include: {
        clinicalReports: {
          include: {
            professional: {
              select: {
                name: true,
                specialty: true
              }
            }
          },
          orderBy: { date: 'desc' } // Reportes más recientes primero
        }
      }
    });

    if (!patientFile) {
      res.status(404).json({ message: 'Paciente no encontrado.' });
      return;
    }

    res.json(patientFile);
  } catch (error: any) {
    res.status(500).json({ message: 'Error al recuperar la ficha clínica', error: error.message });
  }
};

// 3. Registrar / Enviar el reporte clínico de la sesión 
export const createClinicalReport = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const professionalId = req.professional?.id;
    const {
      patientId,
      therapeuticGoal,
      activityPerformed,
      goalsAchieved,
      clinicalObservations,
      behaviorObservation,
      additionalComments
    } = req.body;

    // Validación de campos obligatorios según requerimientos 
    if (
      !patientId ||
      !therapeuticGoal ||
      !activityPerformed ||
      !goalsAchieved ||
      !clinicalObservations ||
      !behaviorObservation
    ) {
      res.status(400).json({ message: 'Todos los campos clínicos obligatorios deben ser completados.' });
      return;
    }

    const targetPatientId = parseInt(patientId, 10);
    const patientExists = await prisma.patient.findUnique({ where: { id: targetPatientId } });
    
    if (!patientExists) {
      res.status(404).json({ message: 'El paciente especificado no existe.' });
      return;
    }

    const newReport = await prisma.clinicalReport.create({
      data: {
        patientId: targetPatientId,
        professionalId: professionalId!,
        therapeuticGoal,
        activityPerformed,
        goalsAchieved,
        clinicalObservations,
        behaviorObservation,
        additionalComments
      }
    });

    res.status(201).json({
      message: 'Reporte clínico enviado correctamente.',
      report: newReport
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al enviar el reporte clínico', error: error.message });
  }
};