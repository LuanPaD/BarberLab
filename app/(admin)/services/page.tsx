import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { BanknoteIcon, ClockIcon, ScissorsIcon } from "lucide-react"
import { redirect } from "next/navigation"
import PageHeader from "../_components/page-header"
import ServicesManager from "../_components/services-manager"
import StatCard from "../_components/stat-card"
import { getAdminServices } from "../_data/get-services"
import { formatCurrency, formatDuration } from "../_lib/format"

const Services = async () => {
  const admin = await requireBarbershopAdmin()
  if (!admin) redirect("/")

  const services = await getAdminServices(admin.barbershopId)
  const active = services.filter((service) => service.isActive)

  const averagePrice = active.length
    ? active.reduce((sum, service) => sum + service.price, 0) / active.length
    : 0
  const averageDuration = active.length
    ? Math.round(
        active.reduce((sum, service) => sum + service.durationMinutes, 0) /
          active.length,
      )
    : 0

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-5 lg:px-8 lg:py-10">
      <PageHeader
        eyebrow="Catálogo"
        title="Serviços"
        description="O que sua barbearia oferece, com preço e tempo de cadeira."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 lg:gap-4">
        <StatCard
          label="Ativos"
          value={`${active.length}/${services.length}`}
          icon={ScissorsIcon}
          tone="primary"
        />
        <StatCard
          label="Preço médio"
          value={formatCurrency(averagePrice)}
          icon={BanknoteIcon}
        />
        <div className="col-span-2 lg:col-span-1">
          <StatCard
            label="Duração média"
            value={averageDuration ? formatDuration(averageDuration) : "—"}
            icon={ClockIcon}
          />
        </div>
      </div>

      <div className="space-y-3">
        <ServicesManager services={services} />
      </div>
    </div>
  )
}

export default Services
