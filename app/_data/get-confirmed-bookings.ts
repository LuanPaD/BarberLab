"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "../_lib/auth"
import { db } from "../_lib/prisma"

export const getConfirmedBookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return []
  }
  const bookings = await db.booking.findMany({
    where: {
      userId: (session.user as { id: string }).id,
      date: {
        gte: new Date(),
      },
    },
    select: {
      id: true,
      date: true,
      service: {
        select: {
          name: true,
          price: true,
          barbershop: {
            select: {
              name: true,
              address: true,
              imageUrl: true,
              phones: true,
            },
          },
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return bookings.map(toBookingItem)
}

/** Só o que o BookingItem desenha, para não inflar o payload. */
const toBookingItem = (booking: {
  id: string
  date: Date
  service: {
    name: string
    price: unknown
    barbershop: {
      name: string
      address: string
      imageUrl: string
      phones: string[]
    }
  }
}) => ({
  id: booking.id,
  date: booking.date,
  service: {
    name: booking.service.name,
    price: Number(booking.service.price),
    barbershop: booking.service.barbershop,
  },
})
