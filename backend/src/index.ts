import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta de prueba con Tipado Estricto de TS
app.get('/', (req: Request, res: Response) => {
    res.json({ 
        mensaje: "¡Conexión exitosa!",
        status: "ok"
    });
});

app.get('/wena', (req: Request, res: Response) => {
    res.json({ 
        mensaje: "kie exitosa!",
        status: "ok"
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor Express + TS corriendo en http://localhost:${PORT}`);
});