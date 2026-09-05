import BookingItem from "@/app/_components/booking-item"
import Header from "@/app/_components/header"
import { getBarbershopsById } from "@/app/_data/get-barbershop-by-id"
import { getConfirmedBookings } from "@/app/_data/get-confirmed-bookings"
import { getBarbershopOpeningHours } from "@/app/_data/get-opening-hours"
import { SINGLE_BARBERSHOP_ID, isSingleTenant } from "@/app/_lib/deployment"
import type { Metadata } from "next"
import { CalendarIcon } from "lucide-react"
import { notFound } from "next/navigation"
import AccessNotice from "./_components/access-notice"
import BarbershopDetail from "./_components/barbershop-detail"
import CatalogHome from "./_components/catalog-home"

interface HomeProps {
  searchParams: Promise<{ erro?: string }>
}

export async function generateMetadata(): Promise<Metadata> {
  if (!isSingleTenant) return {}

  const barbershop = await getBarbershopsById(SINGLE_BARBERSHOP_ID!)
  if (!barbershop) return {}

  return {
    title: `${barbershop.name} | Agendamento online`,
    description: `Agende online na ${barbershop.name}, em ${barbershop.address}. Veja os serviços, preços e horários disponíveis.`,
  }
}

const Home = async ({ searchParams }: HomeProps) => {
  const { erro } = await searchParams

  if (!isSingleTenant) {
    return <CatalogHome erro={erro} />
  }

  const barbershop = await getBarbershopsById(SINGLE_BARBERSHOP_ID!)
  if (!barbershop) {
    notFound()
  }

  const [openingHours, confirmedBookings] = await Promise.all([
    getBarbershopOpeningHours(barbershop.id),
    getConfirmedBookings(),
  ])

  return (
    <div className="from-background via-background to-muted/20 min-h-svh bg-linear-to-br">
      <AccessNotice error={erro} />
      <Header singleTenant />

      <BarbershopDetail
        barbershop={barbershop}
        openingHours={openingHours}
        showHeroNav={false}
        singleTenant
        sidebarSlot={
          confirmedBookings.length > 0 ? (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="text-primary h-5 w-5" />
                <h2 className="text-lg font-semibold">Seus agendamentos</h2>
              </div>
              <div className="space-y-3">
                {confirmedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </section>
          ) : null
        }
      />
    </div>
  )
}

export default Home
