import { headers } from "next/headers"
import {
  RateLimiterMemory,
  RateLimiterPostgres,
  RateLimiterRes,
  type RateLimiterAbstract,
} from "rate-limiter-flexible"
import { getPool } from "./prisma"

export const RATE_LIMITS = {
  createBooking: { points: 5, duration: 60 },
  readSchedule: { points: 30, duration: 60 },
  adminWrite: { points: 20, duration: 60 },
} as const

export type RateLimitName = keyof typeof RATE_LIMITS

const limiters = new Map<RateLimitName, RateLimiterAbstract>()

const createLimiter = (name: RateLimitName): RateLimiterAbstract => {
  const { points, duration } = RATE_LIMITS[name]

  return new RateLimiterPostgres({
    storeClient: getPool(),
    storeType: "pool",
    tableName: "RateLimit",
    tableCreated: true,
    keyPrefix: name,
    points,
    duration,
    insuranceLimiter: new RateLimiterMemory({ points, duration }),
  })
}

const getLimiter = (name: RateLimitName) => {
  const existing = limiters.get(name)
  if (existing) return existing

  const limiter = createLimiter(name)
  limiters.set(name, limiter)
  return limiter
}

interface RateLimitResult {
  allowed: boolean
  retryAfterSeconds: number
}

export const consumeRateLimit = async (
  name: RateLimitName,
  key: string,
): Promise<RateLimitResult> => {
  try {
    await getLimiter(name).consume(key)
    return { allowed: true, retryAfterSeconds: 0 }
  } catch (rejection) {
    if (rejection instanceof RateLimiterRes) {
      return {
        allowed: false,
        retryAfterSeconds: Math.ceil(rejection.msBeforeNext / 1000),
      }
    }

    console.error("[rate-limit] falha ao consumir", name, rejection)
    return { allowed: true, retryAfterSeconds: 0 }
  }
}

export const rateLimitError = (retryAfterSeconds: number) => ({
  ok: false as const,
  error:
    retryAfterSeconds > 60
      ? "Muitas tentativas. Tente de novo daqui a alguns minutos."
      : `Muitas tentativas. Tente de novo em ${retryAfterSeconds}s.`,
})

export const getClientIp = async () => {
  const requestHeaders = await headers()
  const forwarded = requestHeaders.get("x-forwarded-for")

  return (
    forwarded?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  )
}
