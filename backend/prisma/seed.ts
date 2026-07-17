// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@interterapia.cl';
  const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSeguro2026!';
  const adminName = 'Administrador InterTerapia';

  // Verificar si el admin ya existe
  const existingAdmin = await prisma.administrator.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    
    await prisma.administrator.create({
      data: {
        email: adminEmail,
        password: hashedPassword,
        name: adminName,
      },
    });
    console.log(`✅ Administrador creado con éxito: ${adminEmail}`);
  } else {
    console.log('ℹ️ El administrador ya se encuentra registrado.');
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });