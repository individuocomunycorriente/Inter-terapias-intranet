import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
// Nota: Aquí importarías tu base de datos (Prisma, pg, Sequelize, etc.)
// Simularemos un array en memoria temporal para este ejemplo

export const createProfessional = async (req: Request, res: Response) => {
  const { name, email, password, specialty } = req.body;

  if (!name || !email || !password || !specialty) {
    return res.status(400).json({ message: 'Todos los campos son obligatorios.' });
  }

  // REQUERIMIENTO DEL CLIENTE: Validar dominio institucional @interterapia.cl
  if (!email.endsWith('@interterapia.cl')) {
    return res.status(400).json({ 
      message: 'El correo electrónico debe pertenecer al dominio institucional (@interterapia.cl).' 
    });
  }

  try {
    // 1. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 2. Guardar en base de datos (Simulado)
    const newProfessional = {
      id: "uuid-generado", 
      name,
      email,
      passwordHash,
      role: 'professional' as const,
      specialty,
      createdAt: new Date()
    };

    // db.users.create(newProfessional)...

    return res.status(201).json({
      message: 'Profesional creado con éxito.',
      user: {
        id: newProfessional.id,
        name: newProfessional.name,
        email: newProfessional.email,
        specialty: newProfessional.specialty
      }
    });

  } catch (error) {
    return res.status(500).json({ message: 'Error interno del servidor.', error });
  }
};

export const deleteProfessional = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Buscar y eliminar de la base de datos (Simulado)
    // const user = await db.users.delete(id);
    
    return res.status(200).json({ message: `Profesional con ID ${id} eliminado con éxito.` });
  } catch (error) {
    return res.status(500).json({ message: 'Error al eliminar el profesional.' });
  }
};