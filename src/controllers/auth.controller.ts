// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../db';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
      return;
    }

    // Validación rigurosa de dominio institucional requerida por el cliente 
    if (!email.endsWith('@interterapia.cl')) {
      res.status(403).json({ message: 'Acceso exclusivo con correo institucional (@interterapia.cl).' });
      return;
    }

    const professional = await prisma.professional.findUnique({
      where: { email },
    });

    if (!professional) {
      res.status(401).json({ message: 'Credenciales inválidas.' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, professional.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Credenciales inválidas.' });
      return;
    }

    // Firmar el Token JWT
    const token = jwt.sign(
      { id: professional.id, email: professional.email, specialty: professional.specialty },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.json({
      message: 'Autenticación exitosa',
      token,
      professional: {
        id: professional.id,
        name: professional.name,
        email: professional.email,
        specialty: professional.specialty,
        imageUrl: professional.imageUrl
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error interno del servidor', error: error.message });
  }
};

export const registerProfessional = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, specialty, imageUrl } = req.body;

    if (!name || !email || !password || !specialty) {
      res.status(400).json({ message: 'Faltan campos requeridos.' });
      return;
    }

    if (!email.endsWith('@interterapia.cl')) {
      res.status(400).json({ message: 'El correo debe pertenecer al dominio @interterapia.cl' });
      return;
    }

    const existing = await prisma.professional.findUnique({ where: { email } });
    if (existing) {
      res.status(400).json({ message: 'El profesional ya se encuentra registrado.' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newProfessional = await prisma.professional.create({
      data: {
        name,
        email,
        password: hashedPassword,
        specialty,
        imageUrl
      }
    });

    res.status(201).json({
      message: 'Profesional registrado con éxito',
      professional: {
        id: newProfessional.id,
        name: newProfessional.name,
        email: newProfessional.email,
        specialty: newProfessional.specialty
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error al registrar profesional', error: error.message });
  }
};