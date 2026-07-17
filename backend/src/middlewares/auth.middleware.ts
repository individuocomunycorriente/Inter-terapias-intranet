import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export interface AuthTokenPayload {
  id: number;
  email: string;
  role: 'admin' | 'professional';
  specialty?: string;
}

export const requireAuth = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: 'No autorizado. Inicia sesión para continuar.' });
    return;
  }

  try {
    const decoded = jwt.verify(token, env.jwtSecret) as AuthTokenPayload;

    // Validar el correo institucional requerido por requerimiento
    if (!decoded.email.endsWith('@interterapia.cl')) {
      res.status(403).json({ message: 'Acceso denegado. Se requiere un correo institucional de InterTerapia.' });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Sesión inválida o expirada.' });
  }
};

export const requireRole = (...roles: Array<'admin' | 'professional'>) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'No tienes permisos para realizar esta acción.' });
      return;
    }
    next();
  };
};
