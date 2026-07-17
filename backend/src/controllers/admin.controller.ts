// src/controllers/admin.controller.ts
import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { Prisma } from '@prisma/client';
import { prisma } from '../db';
import { AppError } from '../utils/AppError';
import { parseId } from '../utils/parseId';

const PROFESSIONAL_PUBLIC_FIELDS = {
  id: true,
  name: true,
  email: true,
  specialty: true,
  imageUrl: true,
  createdAt: true,
  updatedAt: true,
} as const;

// ----- Profesionales -----

export const listProfessionals = async (req: Request, res: Response): Promise<void> => {
  const professionals = await prisma.professional.findMany({
    select: PROFESSIONAL_PUBLIC_FIELDS,
    orderBy: { name: 'asc' },
  });
  res.json(professionals);
};

export const createProfessional = async (req: Request, res: Response): Promise<void> => {
  const { name, email, password, specialty, imageUrl } = req.body;

  const existing = await prisma.professional.findUnique({ where: { email } });
  if (existing) {
    throw new AppError(409, 'Ya existe un profesional registrado con ese correo.');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const professional = await prisma.professional.create({
    data: { name, email, password: hashedPassword, specialty, imageUrl: imageUrl || null },
    select: PROFESSIONAL_PUBLIC_FIELDS,
  });

  res.status(201).json({ message: 'Profesional creado con éxito.', professional });
};

export const updateProfessional = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  const { name, email, password, specialty, imageUrl } = req.body;

  const data: Prisma.ProfessionalUpdateInput = {};
  if (name !== undefined) data.name = name;
  if (email !== undefined) data.email = email;
  if (specialty !== undefined) data.specialty = specialty;
  if (imageUrl !== undefined) data.imageUrl = imageUrl || null;
  if (password) data.password = await bcrypt.hash(password, 10);

  try {
    const professional = await prisma.professional.update({
      where: { id },
      data,
      select: PROFESSIONAL_PUBLIC_FIELDS,
    });
    res.json({ message: 'Profesional actualizado con éxito.', professional });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError(404, 'Profesional no encontrado.');
      if (error.code === 'P2002') throw new AppError(409, 'Ya existe un profesional registrado con ese correo.');
    }
    throw error;
  }
};

export const deleteProfessional = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);

  try {
    await prisma.professional.delete({ where: { id } });
    res.json({ message: 'Profesional eliminado con éxito.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError(404, 'Profesional no encontrado.');
      if (error.code === 'P2003') {
        throw new AppError(409, 'No se puede eliminar: el profesional tiene informes clínicos asociados.');
      }
    }
    throw error;
  }
};

// ----- Pacientes -----

export const createPatient = async (req: Request, res: Response): Promise<void> => {
  const { fullName, rut, age, contactPhone, guardianName, initialSurveyData } = req.body;

  const existing = await prisma.patient.findUnique({ where: { rut } });
  if (existing) {
    throw new AppError(409, 'Ya existe un paciente registrado con ese RUT.');
  }

  const patient = await prisma.patient.create({
    data: {
      fullName,
      rut,
      age,
      contactPhone: contactPhone || null,
      guardianName: guardianName || null,
      initialSurveyData: initialSurveyData ?? Prisma.JsonNull,
    },
  });

  res.status(201).json({ message: 'Paciente creado con éxito.', patient });
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);
  const { fullName, rut, age, contactPhone, guardianName, initialSurveyData } = req.body;

  const data: Prisma.PatientUpdateInput = {};
  if (fullName !== undefined) data.fullName = fullName;
  if (rut !== undefined) data.rut = rut;
  if (age !== undefined) data.age = age;
  if (contactPhone !== undefined) data.contactPhone = contactPhone || null;
  if (guardianName !== undefined) data.guardianName = guardianName || null;
  if (initialSurveyData !== undefined) data.initialSurveyData = initialSurveyData ?? Prisma.JsonNull;

  try {
    const patient = await prisma.patient.update({ where: { id }, data });
    res.json({ message: 'Paciente actualizado con éxito.', patient });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') throw new AppError(404, 'Paciente no encontrado.');
      if (error.code === 'P2002') throw new AppError(409, 'Ya existe un paciente registrado con ese RUT.');
    }
    throw error;
  }
};

export const deletePatient = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);

  try {
    await prisma.patient.delete({ where: { id } });
    res.json({ message: 'Paciente eliminado con éxito.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError(404, 'Paciente no encontrado.');
    }
    throw error;
  }
};

// ----- Informes clínicos -----

export const deleteReport = async (req: Request, res: Response): Promise<void> => {
  const id = parseId(req.params.id);

  try {
    await prisma.clinicalReport.delete({ where: { id } });
    res.json({ message: 'Informe eliminado con éxito.' });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      throw new AppError(404, 'Informe no encontrado.');
    }
    throw error;
  }
};
