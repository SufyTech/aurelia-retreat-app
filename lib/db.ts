import { PrismaClient } from '@prisma/client'

// Standard Next.js + Prisma pattern: reuse one client across hot reloads in
// dev, and across warm serverless invocations in production, instead of
// creating a new database connection pool on every request.

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
