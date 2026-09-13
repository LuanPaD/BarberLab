"use server"

import { BookingStatus } from "@prisma/client"
import { addMinutes, endOfDay, startOfDay } from "date-fns"
import { auth } from "../_lib/auth"
import { db } from "../_lib/prisma"
import { withDefaults } from "../_lib/opening-hours"
import { consumeRateLimit, getClientIp } from "../_lib/rate-limit"

interface GetUnavailableIntervalsProps {
  serviceId: string
  date: Date
}

export interface UnavailableInterval {
  startsAt: Date
  endsAt: Date
}

export const getUnavailableIntervals = async ({
  serviceId,
  date,
}: GetUnavailableIntervalsProps): Promise<UnavailableInterval[]> => {
  const session = await auth()
  if (!session?.user) return []

  const limit = await consumeRateLimit("readSchedule", session.user.id)
  if (!limit.allowed) return []

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

export const getServiceOpeningHours = async (serviceId: string) => {
  const limit = await consumeRateLimit("readSchedule", await getClientIp())
  if (!limit.allowed) return []

  const service = await db.barbershopService.findUnique({
    where: { id: serviceId },
    select: { barbershopId: true },
  })
  if (!service) return []

  const hours = await db.openingHour.findMany({
    where: { barbershopId: service.barbershopId },
    orderBy: { weekday: "asc" },
    select: { weekday: true, opensAt: true, closesAt: true, isClosed: true },
  })

  return withDefaults(hours)
}
