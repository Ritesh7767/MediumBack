// prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

// Prevent multiple instances of Prisma Client in development
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query'], // Optional: Logs every query for debugging
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
