"use server"

import { auth } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const schema = z.object({
  phone: z
    .string()
    .trim()
    .regex(
      /^\+?[\d\s().-]{8,20}$/,
      "Telefone inválido. Use algo como (11) 99999-9999.",
    )
    .or(z.literal("")),
})

export const updateOwnPhone = async (input: unknown) => {
  const session = await auth()
  if (!session?.user?.id) {
    return { ok: false as const, error: "Faça login para continuar." }
  }

  const parsed = schema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false as const,
      error: parsed.error.issues[0]?.message ?? "Dados inválidos.",
    }
  }

  await db.user.update({
    where: { id: session.user.id },
    data: { phone: parsed.data.phone || null },
  })

  revalidatePath("/perfil")
  revalidatePath("/bookings")

  return { ok: true as const }
}
