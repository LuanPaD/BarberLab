import { withDefaults } from "@/app/_lib/opening-hours"
import { db } from "@/app/_lib/prisma"

export const getBarbershopOpeningHours = async (barbershopId: string) =>
  withDefaults(
    await db.openingHour.findMany({
      where: { barbershopId },
      orderBy: { weekday: "asc" },
      select: { weekday: true, opensAt: true, closesAt: true, isClosed: true },
    }),
  )
