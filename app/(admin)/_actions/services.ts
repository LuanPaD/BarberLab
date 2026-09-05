"use server"

import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { serviceSchema } from "../_lib/service-schema"

const revalidateServices = () => {
  revalidatePath("/services")
  revalidatePath("/dashboard")
  revalidatePath("/barbershops")
  revalidatePath("/")
}

export const upsertService = async (input: unknown) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) {
    return { ok: false as const, error: "Acesso negado." }
  }

  const parsed = serviceSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    }
  }

  const { id, price, ...rest } = parsed.data
  const data = { ...rest, price: new Prisma.Decimal(price.toFixed(2)) }

  if (id) {
    const result = await db.barbershopService.updateMany({
      where: { id, barbershopId: admin.barbershopId },
      data,
    })

    if (result.count === 0) {
      return { ok: false as const, error: "Serviço não encontrado." }
    }
  } else {
    await db.barbershopService.create({
      data: { ...data, barbershopId: admin.barbershopId },
    })
  }

  revalidateServices()

  return { ok: true as const }
}

export const setServiceActive = async (
  serviceId: string,
  isActive: boolean,
) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) {
    return { ok: false as const, error: "Acesso negado." }
  }

  const result = await db.barbershopService.updateMany({
    where: { id: serviceId, barbershopId: admin.barbershopId },
    data: { isActive },
  })

  if (result.count === 0) {
    return { ok: false as const, error: "Serviço não encontrado." }
  }

  revalidateServices()

  return { ok: true as const }
}

export const deleteService = async (serviceId: string) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) {
    return { ok: false as const, error: "Acesso negado." }
  }

  const service = await db.barbershopService.findFirst({
    where: { id: serviceId, barbershopId: admin.barbershopId },
    select: { _count: { select: { bookings: true } } },
  })

  if (!service) {
    return { ok: false as const, error: "Serviço não encontrado." }
  }

  // A FK é RESTRICT: desativar preserva o histórico das reservas.
  if (service._count.bookings > 0) {
    return {
      ok: false as const,
      error:
        "Esse serviço já tem agendamentos e não pode ser excluído. Desative-o para tirá-lo do site.",
    }
  }

  await db.barbershopService.delete({ where: { id: serviceId } })

  revalidateServices()

  return { ok: true as const }
}
