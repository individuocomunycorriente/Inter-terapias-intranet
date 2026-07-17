// src/controllers/patient.controller.ts
import { Request, Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { AppError } from '../utils/AppError';
import { parseId } from '../utils/parseId';

// 1. Obtener listado de todos los pacientes para la selección
export const getPatients = async (req: Request, res: Response): Promise<void> => {
  const patients = await prisma.patient.findMany({
    select: {
      id: true,
      fullName: true,
      rut: true,
      age: true,
    },
    orderBy: { fullName: 'asc' },
  });
  res.json(patients);
};

// 2. Obtener la ficha clínica prellenada y el historial clínico completo del paciente
export const getPatientClinicalFile = async (req: Request, res: Response): Promise<void> => {
  const patientId = parseId(req.params.id);

  const patientFile = await prisma.patient.findUnique({
    where: { id: patientId },
    include: {
      clinicalReports: {
        include: {
          professional: {
            select: {
              id: true,
              name: true,
              specialty: true,
            },
          },
        },
        orderBy: { date: 'desc' }, // Reportes más recientes primero
      },
    },
  });

  if (!patientFile) {
    throw new AppError(404, 'Paciente no encontrado.');
  }

  res.json(patientFile);
};

// 3. Registrar / Enviar el reporte clínico de la sesión
export const createClinicalReport = async (req: Request, res: Response): Promise<void> => {
  if (req.user?.role !== 'professional') {
    throw new AppError(403, 'Solo un profesional puede registrar un informe clínico.');
  }

  const {
    patientId,
    therapeuticGoal,
    activityPerformed,
    goalsAchieved,
    clinicalObservations,
    behaviorObservation,
    additionalComments,
  } = req.body;

  const patientExists = await prisma.patient.findUnique({ where: { id: patientId } });
  if (!patientExists) {
    throw new AppError(404, 'El paciente especificado no existe.');
  }

  const newReport = await prisma.clinicalReport.create({
    data: {
      patientId,
      professionalId: req.user.id,
      therapeuticGoal,
      activityPerformed,
      goalsAchieved,
      clinicalObservations,
      behaviorObservation,
      additionalComments: additionalComments || null,
    },
  });

  res.status(201).json({
    message: 'Reporte clínico enviado correctamente.',
    report: newReport,
  });
};

// 4. Editar un reporte clínico existente — el profesional solo puede editar los suyos; el admin, cualquiera
export const updateClinicalReport = async (req: Request, res: Response): Promise<void> => {
  const reportId = parseId(req.params.id);

  const report = await prisma.clinicalReport.findUnique({ where: { id: reportId } });
  if (!report) {
    throw new AppError(404, 'Informe no encontrado.');
  }

  if (req.user?.role === 'professional' && report.professionalId !== req.user.id) {
    throw new AppError(403, 'Solo puedes editar los informes que tú mismo creaste.');
  }

  const {
    therapeuticGoal,
    activityPerformed,
    goalsAchieved,
    clinicalObservations,
    behaviorObservation,
    additionalComments,
  } = req.body;

  const data: Prisma.ClinicalReportUpdateInput = {};
  if (therapeuticGoal !== undefined) data.therapeuticGoal = therapeuticGoal;
  if (activityPerformed !== undefined) data.activityPerformed = activityPerformed;
  if (goalsAchieved !== undefined) data.goalsAchieved = goalsAchieved;
  if (clinicalObservations !== undefined) data.clinicalObservations = clinicalObservations;
  if (behaviorObservation !== undefined) data.behaviorObservation = behaviorObservation;
  if (additionalComments !== undefined) data.additionalComments = additionalComments || null;

  const updatedReport = await prisma.clinicalReport.update({
    where: { id: reportId },
    data,
  });

  res.json({ message: 'Informe actualizado correctamente.', report: updatedReport });
};
