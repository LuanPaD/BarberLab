import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import OpeningHoursForm from "../_components/opening-hours-form"
import PageHeader from "../_components/page-header"

export const metadata: Metadata = {
  title: "Configurações | Barber Lab",
  description: "Horário de funcionamento e dados da barbearia.",
}

const PADRAO = [0, 1, 2, 3, 4, 5, 6].map((weekday) => ({
  weekday,
  opensAt: "09:00",
  closesAt: "18:00",
  isClosed: weekday === 0,
}))

const Settings = async () => {
  const admin = await requireBarbershopAdmin()
  if (!admin) redirect("/")

  const salvos = await db.openingHour.findMany({
    where: { barbershopId: admin.barbershopId },
    orderBy: { weekday: "asc" },
    select: { weekday: true, opensAt: true, closesAt: true, isClosed: true },
  })

  const hours = PADRAO.map(
    (padrao) => salvos.find((s) => s.weekday === padrao.weekday) ?? padrao,
  )

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
