// src/index.ts
import express from 'express';
import cors from 'cors';
import publicRoutes from './routes/public.routes';
import clinicalRoutes from './routes/clinical.routes';

const app = express();
const PORT = process.env.PORT || 4000;

// Configuración de CORS y Parseadores de Body
app.use(cors());
app.use(express.json());

// Endpoints Públicos e Intranet
app.use('/api', publicRoutes);
app.use('/api', clinicalRoutes);

// Endpoint de verificación del estado de salud del Backend
app.get('/health', (req, res) => {
  res.json({ status: 'OK', service: 'InterTerapia API' });
});

app.listen(PORT, () => {
  console.log(`Servidor de InterTerapia corriendo en el puerto ${PORT}`);
});