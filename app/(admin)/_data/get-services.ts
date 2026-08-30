import { db } from "@/app/_lib/prisma"

export interface AdminService {
  id: string
  name: string
  description: string
  imageUrl: string
  price: number
  durationMinutes: number
  isActive: boolean
  bookingsCount: number
}

export const getAdminServices = async (
  barbershopId: string,
): Promise<AdminService[]> => {
  const services = await db.barbershopService.findMany({
    where: { barbershopId },
    orderBy: [{ isActive: "desc" }, { name: "asc" }],
    select: {
      id: true,
      name: true,
      description: true,
      imageUrl: true,
      price: true,
      durationMinutes: true,
      isActive: true,
      _count: { select: { bookings: true } },
    },
  })

  return services.map((service) => ({
    id: service.id,
    name: service.name,
    description: service.description,
    imageUrl: service.imageUrl,
    price: Number(service.price),
    durationMinutes: service.durationMinutes,
    isActive: service.isActive,
    bookingsCount: service._count.bookings,
  }))
}
