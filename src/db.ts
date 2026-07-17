import { PrismaClient } from '@prisma/client';

// Instanciamos el cliente de Prisma

export const prisma = new PrismaClient({ datasourceUrl: process.env.DATABASE_URL });;