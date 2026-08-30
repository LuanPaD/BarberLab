import fs from "node:fs"
import path from "node:path"
import { defineConfig, env } from "prisma/config"

// O Prisma 7 não carrega mais o .env automaticamente.
loadEnvFile(".env")
loadEnvFile(".env.local")

function loadEnvFile(file: string) {
  const filePath = path.resolve(process.cwd(), file)
  if (!fs.existsSync(filePath)) return

  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)\s*$/)
    if (!match) continue

    const key = match[1]
    const value = match[2].trim().replace(/^["']|["']$/g, "")
    if (!(key in process.env)) process.env[key] = value
  }
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
})
