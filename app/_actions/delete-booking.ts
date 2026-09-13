"use server"

import { Role } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { auth } from "../_lib/auth"
import { db } from "../_lib/prisma"

export const deleteBooking = async (bookingId: string) => {
  const session = await auth()

  if (!session?.user) {
    return { ok: false as const, error: "Você precisa estar logado." }
  }

  if (typeof bookingId !== "string" || bookingId.length === 0) {
    return { ok: false as const, error: "Reserva inválida." }
  }

  const booking = await db.booking.findUnique({
    where: { id: bookingId },
    select: {
      userId: true,
      service: { select: { barbershopId: true } },
    },
  })

  if (!booking) {
    return { ok: false as const, error: "Reserva não encontrada." }
  }

  const isOwner = booking.userId === session.user.id
  const isBarbershopAdmin =
    session.user.role === Role.BARBER_ADMIN &&
    session.user.barbershopId === booking.service.barbershopId

  if (!isOwner && !isBarbershopAdmin) {
    return { ok: false as const, error: "Reserva não encontrada." }
  }

  await db.booking.delete({ where: { id: bookingId } })

  revalidatePath("/bookings", "page")
  revalidatePath("/", "page")
  revalidatePath("/dashboard")
  revalidatePath("/schedule")

  return { ok: true as const }
}
