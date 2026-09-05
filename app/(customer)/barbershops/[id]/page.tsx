import { getBarbershopsById } from "@/app/_data/get-barbershop-by-id"
import { getBarbershopOpeningHours } from "@/app/_data/get-opening-hours"
import { SINGLE_BARBERSHOP_ID, isSingleTenant } from "@/app/_lib/deployment"
import type { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import BarbershopDetail from "../../_components/barbershop-detail"

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params
  const barbershop = await getBarbershopsById(id)

  if (!barbershop) {
    return { title: "Barbearia não encontrada | Barber Lab" }
  }

  return {
    title: `${barbershop.name} | Barber Lab`,
    description: `Agende online na ${barbershop.name}, em ${barbershop.address}. Veja os serviços, preços e horários disponíveis.`,
  }
}

export default async function BarbershopPage({ params }: any) {
  const { id } = await params

  // Venda unitária: a barbearia da casa mora na home; qualquer outra não existe.
  if (isSingleTenant) {
    if (id === SINGLE_BARBERSHOP_ID) redirect("/")
    notFound()
  }

  const barbershop = await getBarbershopsById(id)
  if (!barbershop) {
    return notFound()
  }

  const openingHours = await getBarbershopOpeningHours(id)

  return (
    <BarbershopDetail barbershop={barbershop} openingHours={openingHours} />
  )
}
