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
    // `sslmode`/`channel_binding` na URL fazem o pg-connection-string emitir
    // um aviso de depreciação a cada boot. O SSL é configurado abaixo, então
    // esses parâmetros são redundantes aqui (o Prisma CLI continua usando a
    // URL original do .env).
    const url = new URL(connectionString)
    url.searchParams.delete("sslmode")
    url.searchParams.delete("channel_binding")

    globalThis.cachedPool = new Pool({
      connectionString: url.toString(),
      // Verificação completa do certificado (o Neon apresenta cadeia válida).
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
