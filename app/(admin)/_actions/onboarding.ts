"use server"

import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"

export const completeOnboarding = async () => {
  const admin = await requireBarbershopAdmin()
  if (!admin) return { ok: false as const }

  await db.user.update({
    where: { id: admin.userId },
    data: { onboardingDoneAt: new Date() },
  })

  return { ok: true as const }
}
