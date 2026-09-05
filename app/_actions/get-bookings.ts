"use server"

import { BookingStatus } from "@prisma/client"
import { addMinutes, endOfDay, startOfDay } from "date-fns"
import { auth } from "../_lib/auth"
import { db } from "../_lib/prisma"

interface GetUnavailableIntervalsProps {
  serviceId: string
  date: Date
}

export interface UnavailableInterval {
  startsAt: Date
  endsAt: Date
}

/** Faixas ocupadas do dia: reservas e bloqueios, sem expor de quem são. */
export const getUnavailableIntervals = async ({
  serviceId,
  date,
}: GetUnavailableIntervalsProps): Promise<UnavailableInterval[]> => {
  const session = await auth()
  if (!session?.user) return []

  const service = await db.barbershopService.findUnique({
    where: { id: serviceId },
    select: { barbershopId: true },
  })
  if (!service) return []

  const from = startOfDay(date)
  const to = endOfDay(date)

  const [bookings, blocks] = await Promise.all([
    db.booking.findMany({
      where: {
        date: { gte: from, lte: to },
        status: { not: BookingStatus.CANCELED },
        service: { barbershopId: service.barbershopId },
      },
      select: {
        date: true,
        service: { select: { durationMinutes: true } },
      },
    }),
    db.scheduleBlock.findMany({
      where: {
        barbershopId: service.barbershopId,
        startsAt: { lte: to },
        endsAt: { gte: from },
      },
      select: { startsAt: true, endsAt: true },
    }),
  ])

  return [
    ...bookings.map((booking) => ({
      startsAt: booking.date,
      endsAt: addMinutes(booking.date, booking.service.durationMinutes),
    })),
    ...blocks.map((block) => ({
      startsAt: block.startsAt,
      endsAt: block.endsAt,
    })),
  ]
}
