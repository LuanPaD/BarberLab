"use server"

import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { BookingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { consumeRateLimit, rateLimitError } from "@/app/_lib/rate-limit"

const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "Horário inválido.")

const createSchema = z
  .object({
    date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data inválida."),
    startTime: timeSchema,
    endTime: timeSchema,
    reason: z.string().trim().max(120).optional(),
  })
  .refine((data) => data.endTime > data.startTime, {
    message: "O fim do bloqueio precisa ser depois do início.",
    path: ["endTime"],
  })

const buildDate = (date: string, time: string) => {
  const [year, month, day] = date.split("-").map(Number)
  const [hour, minute] = time.split(":").map(Number)
  return new Date(year, month - 1, day, hour, minute, 0, 0)
}

export const createScheduleBlock = async (input: unknown) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) {
    return { ok: false as const, error: "Acesso negado." }
  }

  const limit = await consumeRateLimit("adminWrite", admin.barbershopId)
  if (!limit.allowed) {
    return rateLimitError(limit.retryAfterSeconds)
  }

  const parsed = createSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    }
  }

  const { date, startTime, endTime, reason } = parsed.data
  const startsAt = buildDate(date, startTime)
  const endsAt = buildDate(date, endTime)

  const conflicting = await db.booking.count({
    where: {
      status: { not: BookingStatus.CANCELED },
      date: { gte: startsAt, lt: endsAt },
      service: { barbershopId: admin.barbershopId },
    },
  })

  if (conflicting > 0) {
    return {
      ok: false as const,
      error: `Existe ${conflicting} agendamento(s) nesse intervalo. Cancele ou reagende antes de bloquear.`,
    }
  }

  await db.scheduleBlock.create({
    data: {
      barbershopId: admin.barbershopId,
      startsAt,
      endsAt,
      reason: reason || null,
    },
  })

  revalidatePath("/schedule")
  revalidatePath("/dashboard")

  return { ok: true as const }
}

export const deleteScheduleBlock = async (blockId: string) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) {
    return { ok: false as const, error: "Acesso negado." }
  }

  const limit = await consumeRateLimit("adminWrite", admin.barbershopId)
  if (!limit.allowed) {
    return rateLimitError(limit.retryAfterSeconds)
  }

  const result = await db.scheduleBlock.deleteMany({
    where: { id: blockId, barbershopId: admin.barbershopId },
  })

  if (result.count === 0) {
    return { ok: false as const, error: "Bloqueio não encontrado." }
  }

  revalidatePath("/schedule")
  revalidatePath("/dashboard")

  return { ok: true as const }
}
