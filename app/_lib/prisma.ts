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
    // sslmode/channel_binding na URL geram aviso do pg-connection-string e
    // são redundantes: o SSL é configurado abaixo.
    const url = new URL(connectionString)
    url.searchParams.delete("sslmode")
    url.searchParams.delete("channel_binding")

    globalThis.cachedPool = new Pool({
      connectionString: url.toString(),
      ssl: true,
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
