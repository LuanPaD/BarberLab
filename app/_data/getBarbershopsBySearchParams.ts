"use server"

import { db } from "../_lib/prisma"

export const getBarbershopsBySearchParams = async (searchParams: {
  title?: string
  service?: string
}) => {
  if (!searchParams) {
    return []
  }

  return db.barbershop.findMany({
    where: {
      OR: [
        searchParams?.title
          ? {
              name: {
                contains: searchParams?.title,
                mode: "insensitive",
              },
            }
          : {},
        searchParams.service
          ? {
              services: {
                some: {
                  name: {
                    contains: searchParams.service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  })
}
