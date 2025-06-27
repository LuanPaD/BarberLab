"use server"

import { db } from "../_lib/prisma"

export const getBarbershopsById = async (barbershopId: string) => {
  if (!barbershopId) {
    return null
  }

  return db.barbershop.findUnique({
    where: {
      id: barbershopId,
    },
    include: {
      services: true,
    },
  })
}
