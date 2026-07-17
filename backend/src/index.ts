// src/index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import publicRoutes from './routes/public.routes';
import authRoutes from './routes/auth.routes';
import clinicalRoutes from './routes/clinical.routes';
import adminRoutes from './routes/admin.routes';
import { notFoundHandler, errorHandler } from './middlewares/error.middleware';

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));

// Endpoints Públicos e Intranet
app.use('/api', publicRoutes);
app.use('/api', authRoutes);
app.use('/api', clinicalRoutes);
app.use('/api', adminRoutes);

// Endpoint de verificación del estado de salud del Backend
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'InterTerapia API' });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`Servidor de InterTerapia corriendo en el puerto ${env.port}`);
});
