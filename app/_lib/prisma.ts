import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-var
  var cachedPrisma: PrismaClient | undefined
  var cachedPool: Pool | undefined
}

// Load DATABASE_URL from environment
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not set. Please check your .env.local file."
  )
}

// Create shared PostgreSQL pool
if (!globalThis.cachedPool) {
  globalThis.cachedPool = new Pool({ 
    connectionString: connectionString,
    ssl: {
      rejectUnauthorized: false
    }
  })
}
export const pool = globalThis.cachedPool

// Create main Prisma client with PostgreSQL adapter
let prisma: PrismaClient

if (process.env.NODE_ENV === "production") {
  const adapter = new PrismaPg(pool)
  prisma = new PrismaClient({ adapter })
} else {
  if (!globalThis.cachedPrisma) {
    const adapter = new PrismaPg(pool)
    globalThis.cachedPrisma = new PrismaClient({ adapter })
  }
  prisma = globalThis.cachedPrisma!
}

export const db = prisma
