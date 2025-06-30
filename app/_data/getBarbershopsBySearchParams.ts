"use server"

import { db } from "../_lib/prisma"

export const getBarbershopsBySearchParams = async (searchParams: {
  title?: string
  service?: string
  tag?: "recomendados" | "popular"
}) => {
  if (!searchParams) {
    return []
  }

  if (searchParams.tag === "recomendados") {
    return db.barbershop.findMany({})
  }

  if (searchParams.tag === "popular") {
    return db.barbershop.findMany({
      orderBy: {
        name: "desc",
      },
    })
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
