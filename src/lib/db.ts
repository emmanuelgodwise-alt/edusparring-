import { PrismaClient } from '@prisma/client'

/**
 * Prisma Client Singleton Pattern
 *
 * CRITICAL: This prevents connection explosion in development and serverless environments.
 *
 * Without this pattern:
 * - Next.js hot reload → new PrismaClient → new DB connection
 * - After enough reloads: "database locked", "too many connections", server crash
 *
 * This ensures only ONE database client exists across the entire application lifecycle.
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development'
      ? ['query', 'error', 'warn']
      : ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Store in global to prevent new instances during hot reload
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Backwards compatibility alias
export const db = prisma

/**
 * Database Connection Management
 *
 * For production, consider:
 * 1. Connection pooling (PgBouncer for PostgreSQL)
 * 2. Read replicas for leaderboard queries
 * 3. Connection timeouts and retry logic
 */

// Graceful shutdown for serverless environments
if (process.env.NODE_ENV === 'production') {
  process.on('beforeExit', async () => {
    await prisma.$disconnect()
  })
}
