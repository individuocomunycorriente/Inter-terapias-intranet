// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { prisma } from '../db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AppError } from '../utils/AppError';

const COOKIE_OPTIONS = {
  httpOnly: true, // 🔒 Inaccesible para scripts maliciosos de JavaScript en el navegador
  secure: env.isProduction, // Solo viaja por HTTPS en producción
  sameSite: 'lax' as const, // Protección nativa contra ataques CSRF
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Validación obligatoria del dominio institucional (@interterapia.cl)
  if (!email.endsWith('@interterapia.cl')) {
    res.status(403).json({
      message: 'Acceso exclusivo con correo institucional (@interterapia.cl).',
    });
    return;
  }

  // Estrategia de búsqueda en cascada: primero Administrador, luego Profesional
  const administrator = await prisma.administrator.findUnique({ where: { email } });
  const professional = administrator ? null : await prisma.professional.findUnique({ where: { email } });

  const userFound = administrator ?? professional;

  if (!userFound) {
    res.status(401).json({ message: 'Credenciales inválidas.' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(password, userFound.password);
  if (!isPasswordValid) {
    res.status(401).json({ message: 'Credenciales inválidas.' });
    return;
  }

  const role: 'admin' | 'professional' = administrator ? 'admin' : 'professional';

  const token = jwt.sign(
    {
      id: userFound.id,
      email: userFound.email,
      role,
      specialty: professional ? professional.specialty : undefined,
    },
    env.jwtSecret,
    { expiresIn: '8h' }
  );

  res.cookie('token', token, { ...COOKIE_OPTIONS, maxAge: 1000 * 60 * 60 * 8 });

  if (administrator) {
    res.json({
      message: 'Autenticación exitosa como Administrador',
      administrator: {
        id: administrator.id,
        name: administrator.name,
        email: administrator.email,
        role: 'admin',
      },
    });
  } else if (professional) {
    res.json({
      message: 'Autenticación exitosa como Profesional',
      professional: {
        id: professional.id,
        name: professional.name,
        email: professional.email,
        specialty: professional.specialty,
        imageUrl: professional.imageUrl,
        role: 'professional',
      },
    });
  }
};

export const logout = (req: Request, res: Response): void => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ message: 'Sesión cerrada correctamente.' });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  if (!req.user) {
    throw new AppError(401, 'No autorizado.');
  }

  if (req.user.role === 'admin') {
    const administrator = await prisma.administrator.findUnique({ where: { id: req.user.id } });
    if (!administrator) throw new AppError(401, 'La cuenta ya no existe.');
    res.json({
      administrator: {
        id: administrator.id,
        name: administrator.name,
        email: administrator.email,
        role: 'admin',
      },
    });
    return;
  }

  const professional = await prisma.professional.findUnique({ where: { id: req.user.id } });
  if (!professional) throw new AppError(401, 'La cuenta ya no existe.');
  res.json({
    professional: {
      id: professional.id,
      name: professional.name,
      email: professional.email,
      specialty: professional.specialty,
      imageUrl: professional.imageUrl,
      role: 'professional',
    },
  });
};
