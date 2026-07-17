import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../utils/AppError';
import { env } from '../config/env';

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({ message: 'Recurso no encontrado.' });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction): void => {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: 'Datos inválidos.',
      errors: err.issues.map((issue) => ({ path: issue.path.join('.'), message: issue.message })),
    });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({
    message: 'Error interno del servidor.',
    ...(env.isProduction ? {} : { error: err instanceof Error ? err.message : String(err) }),
  });
};
