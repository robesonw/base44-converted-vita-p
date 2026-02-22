import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// This ensures that we are using a single instance of PrismaClient
if (process.env.NODE_ENV !== 'production') {
  global.prisma = global.prisma || prisma;
}

export default prisma;
