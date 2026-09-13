"use server"

import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { BookingStatus } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { consumeRateLimit, rateLimitError } from "@/app/_lib/rate-limit"

const schema = z.object({
  bookingId: z.string().uuid(),
  status: z.enum(BookingStatus),
})

export const updateBookingStatus = async (input: unknown) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) {
    return { ok: false as const, error: "Acesso negado." }
  }

  const limit = await consumeRateLimit("adminWrite", admin.barbershopId)
  if (!limit.allowed) {
    return rateLimitError(limit.retryAfterSeconds)
  }

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return { ok: false as const, error: "Dados inválidos." }
  }

  const result = await db.booking.updateMany({
    where: {
      id: parsed.data.bookingId,
      service: { barbershopId: admin.barbershopId },
    },
    data: { status: parsed.data.status },
  })

  if (result.count === 0) {
    return { ok: false as const, error: "Agendamento não encontrado." }
  }

  revalidatePath("/dashboard")
  revalidatePath("/schedule")
  revalidatePath("/bookings")

  return { ok: true as const }
}
