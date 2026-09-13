"use server"

import { BookingStatus } from "@prisma/client"
import { addMinutes, endOfDay, startOfDay } from "date-fns"
import { revalidatePath } from "next/cache"
import { auth } from "../_lib/auth"
import { db } from "../_lib/prisma"
import {
  buildDaySlots,
  findDayHours,
  withDefaults,
} from "../_lib/opening-hours"
import { consumeRateLimit, rateLimitError } from "../_lib/rate-limit"

interface CreateBookingParams {
  serviceId: string
  date: Date
}

const MAXIMO_DE_RESERVAS_EM_ABERTO = 3

const overlaps = (aStart: Date, aEnd: Date, bStart: Date, bEnd: Date) =>
  aStart < bEnd && aEnd > bStart

export const createBooking = async ({
  serviceId,
  date,
}: CreateBookingParams) => {
  const session = await auth()

  if (!session?.user) {
    return { ok: false as const, error: "Você precisa estar logado." }
  }

  const limit = await consumeRateLimit("createBooking", session.user.id)

  if (!limit.allowed) {
    return rateLimitError(limit.retryAfterSeconds)
  }

  const bookingDate = new Date(date)

  if (Number.isNaN(bookingDate.getTime())) {
    return { ok: false as const, error: "Data inválida." }
  }

  if (bookingDate.getTime() <= Date.now()) {
    return { ok: false as const, error: "Escolha um horário no futuro." }
  }

  const emAberto = await db.booking.count({
    where: {
      userId: session.user.id,
      status: BookingStatus.CONFIRMED,
      date: { gte: new Date() },
    },
  })

  if (emAberto >= MAXIMO_DE_RESERVAS_EM_ABERTO) {
    return {
      ok: false as const,
      error: `Você já tem ${MAXIMO_DE_RESERVAS_EM_ABERTO} horários marcados. Conclua ou cancele um para marcar outro.`,
    }
  }

  const service = await db.barbershopService.findUnique({
    where: { id: serviceId },
    select: {
      id: true,
      isActive: true,
      durationMinutes: true,
      barbershopId: true,
    },
  })

  if (!service || !service.isActive) {
    return { ok: false as const, error: "Serviço indisponível." }
  }

  const openingHours = withDefaults(
    await db.openingHour.findMany({
      where: { barbershopId: service.barbershopId },
      select: { weekday: true, opensAt: true, closesAt: true, isClosed: true },
    }),
  )

  const horarioValido = buildDaySlots(
    findDayHours(openingHours, bookingDate),
    service.durationMinutes,
  ).includes(
    `${String(bookingDate.getHours()).padStart(2, "0")}:${String(
      bookingDate.getMinutes(),
    ).padStart(2, "0")}`,
  )

  if (!horarioValido) {
    return {
      ok: false as const,
      error: "A barbearia não atende nesse horário.",
    }
  }

  const endsAt = addMinutes(bookingDate, service.durationMinutes)
  const from = startOfDay(bookingDate)
  const to = endOfDay(bookingDate)

  const [sameDayBookings, block] = await Promise.all([
    db.booking.findMany({
      where: {
        date: { gte: from, lte: to },
        status: { not: BookingStatus.CANCELED },
        service: { barbershopId: service.barbershopId },
      },
      select: { date: true, service: { select: { durationMinutes: true } } },
    }),
    db.scheduleBlock.findFirst({
      where: {
        barbershopId: service.barbershopId,
        startsAt: { lt: endsAt },
        endsAt: { gt: bookingDate },
      },
      select: { id: true },
    }),
  ])

  if (block) {
    return {
      ok: false as const,
      error: "Esse horário está bloqueado pela barbearia.",
    }
  }

  const conflict = sameDayBookings.some((booking) =>
    overlaps(
      bookingDate,
      endsAt,
      booking.date,
      addMinutes(booking.date, booking.service.durationMinutes),
    ),
  )

  if (conflict) {
    return {
      ok: false as const,
      error: "Esse horário acabou de ser ocupado. Escolha outro.",
    }
  }

  await db.booking.create({
    data: { serviceId, date: bookingDate, userId: session.user.id },
  })

  revalidatePath("/barbershops", "page")
  revalidatePath("/bookings", "page")
  revalidatePath("/dashboard")
  revalidatePath("/schedule")

  return { ok: true as const }
}
