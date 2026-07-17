import { AppError } from './AppError';

export function parseId(raw: string | string[]): number {
  const value = Array.isArray(raw) ? raw[0] : raw;
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError(400, 'Identificador inválido.');
  }
  return id;
}
