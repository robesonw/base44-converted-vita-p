import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add this line for hot reload in development environment
if (process.env.NODE_ENV === 'development') {
  // Prevent multiple instances of PrismaClient in development
  if (global.prisma) {
    module.exports = global.prisma;
  } else {
    global.prisma = prisma;
  }
}

export default prisma;