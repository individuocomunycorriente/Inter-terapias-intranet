import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

export interface AuthenticatedRequest extends Request {
  professional?: {
    id: number;
    email: string;
    specialty: string;
  };
}

export const requireAuth = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No autorizado. Token inexistente o inválido.' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      id: number;
      email: string;
      specialty: string;
    };

    // Validar el correo institucional requerido por requerimiento 
    if (!decoded.email.endsWith('@interterapia.cl')) {
      res.status(403).json({ message: 'Acceso denegado. Se requiere un correo institucional de InterTerapia.' });
      return;
    }

    req.professional = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token inválido o expirado.' });
  }
};