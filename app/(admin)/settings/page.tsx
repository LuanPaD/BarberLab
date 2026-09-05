import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { withDefaults } from "@/app/_lib/opening-hours"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import OpeningHoursForm from "../_components/opening-hours-form"
import PageHeader from "../_components/page-header"

export const metadata: Metadata = {
  title: "Configurações | Barber Lab",
  description: "Horário de funcionamento e dados da barbearia.",
}

const Settings = async () => {
  const admin = await requireBarbershopAdmin()
  if (!admin) redirect("/")

  const salvos = await db.openingHour.findMany({
    where: { barbershopId: admin.barbershopId },
    orderBy: { weekday: "asc" },
    select: { weekday: true, opensAt: true, closesAt: true, isClosed: true },
  })

  const hours = withDefaults(salvos)

  return (
    <div className="mx-auto max-w-3xl space-y-8 p-5 lg:px-8 lg:py-10">
      <PageHeader
        eyebrow="Configurações"
        title="Horário de funcionamento"
        description="Define os horários que aparecem para o cliente na hora de agendar."
      />

      <OpeningHoursForm hours={hours} />
    </div>
  )
}

export default Settings
