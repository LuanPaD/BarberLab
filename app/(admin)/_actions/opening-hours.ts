"use server"

import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { openingHoursSchema } from "../_lib/opening-hours-schema"
import { consumeRateLimit, rateLimitError } from "@/app/_lib/rate-limit"

export const saveOpeningHours = async (input: unknown) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) {
    return { ok: false as const, error: "Acesso negado." }
  }

  const limit = await consumeRateLimit("adminWrite", admin.barbershopId)
  if (!limit.allowed) {
    return rateLimitError(limit.retryAfterSeconds)
  }

  const parsed = openingHoursSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    }
  }

  await db.$transaction(
    parsed.data.map((hour) =>
      db.openingHour.upsert({
        where: {
          barbershopId_weekday: {
            barbershopId: admin.barbershopId,
            weekday: hour.weekday,
          },
        },
        create: { ...hour, barbershopId: admin.barbershopId },
        update: {
          opensAt: hour.opensAt,
          closesAt: hour.closesAt,
          isClosed: hour.isClosed,
        },
      }),
    ),
  )

  revalidatePath("/settings")
  revalidatePath("/schedule")
  revalidatePath("/barbershops")

  return { ok: true as const }
}
