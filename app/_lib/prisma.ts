import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"

declare global {
  // eslint-disable-next-line no-unused-vars
  var cachedPrisma: PrismaClient | undefined
  // eslint-disable-next-line no-unused-vars
  var cachedPool: Pool | undefined
}

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.DATABASE_URL

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Please check your .env.local file.",
    )
  }

  if (!globalThis.cachedPool) {
    globalThis.cachedPool = new Pool({
      connectionString: connectionString,
      ssl: {
        rejectUnauthorized: false,
      },
    })
  }

  if (!globalThis.cachedPrisma) {
    const adapter = new PrismaPg(globalThis.cachedPool)
    globalThis.cachedPrisma = new PrismaClient({ adapter })
  }

  return globalThis.cachedPrisma
}

export const db = new Proxy({} as PrismaClient, {
  get(target, prop) {
    if (!globalThis.cachedPrisma) {
      createPrismaClient()
    }
    return (globalThis.cachedPrisma as any)[prop]
  },
})
