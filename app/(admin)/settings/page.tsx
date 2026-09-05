import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { withDefaults } from "@/app/_lib/opening-hours"
import { db } from "@/app/_lib/prisma"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import BarbershopProfileForm from "../_components/barbershop-profile-form"
import OpeningHoursForm from "../_components/opening-hours-form"
import PageHeader from "../_components/page-header"

export const metadata: Metadata = {
  title: "Configurações | Barber Lab",
  description: "Dados da barbearia e horário de funcionamento.",
}

const Settings = async () => {
  const admin = await requireBarbershopAdmin()
  if (!admin) redirect("/")

  const [barbershop, salvos] = await Promise.all([
    db.barbershop.findUnique({
      where: { id: admin.barbershopId },
      select: {
        name: true,
        address: true,
        description: true,
        imageUrl: true,
        phones: true,
      },
    }),
    db.openingHour.findMany({
      where: { barbershopId: admin.barbershopId },
      orderBy: { weekday: "asc" },
      select: { weekday: true, opensAt: true, closesAt: true, isClosed: true },
    }),
  ])

  if (!barbershop) notFound()

  return (
    <div className="mx-auto max-w-3xl space-y-10 p-5 lg:px-8 lg:py-10">
      <section className="space-y-6">
        <PageHeader
          eyebrow="Configurações"
          title="Dados da barbearia"
          description="Nome, endereço, foto e telefones que o cliente vê antes de agendar."
        />

        <BarbershopProfileForm
          profile={{
            ...barbershop,
            phones: barbershop.phones.length > 0 ? barbershop.phones : [""],
          }}
        />
      </section>

      <section className="space-y-6">
        <PageHeader
          eyebrow="Configurações"
          title="Horário de funcionamento"
          description="Define os horários que aparecem para o cliente na hora de agendar."
        />

        <OpeningHoursForm hours={withDefaults(salvos)} />
      </section>
    </div>
  )
}

export default Settings
