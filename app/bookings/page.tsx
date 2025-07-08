"use server"

import { getServerSession } from "next-auth"
import Header from "../_components/header"
import { authOptions } from "../_lib/auth"
import BookingItem from "../_components/booking-item"
import { getConfirmedBookings } from "../_data/get-confirmed-bookings"
import { getConcludedBookings } from "../_data/get-concluded-bookings"
import {
  Badge,
  CalendarIcon,
  CheckCircleIcon,
  ClockIcon,
  DollarSignIcon,
  MapPinIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react"
import { Button } from "../_components/ui/button"
import Link from "next/link"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../_components/ui/card"

type Booking = {
  id: string
  service: {
    barbershop: {
      name: string
    } | null
  }
}

const Bookings = async () => {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return (
      <>
        <Header />
        <div className="space-y-3 p-5">
          <h1 className="text-xl font-bold">Agendamentos</h1>
          <p className="text-gray-400">
            Você precisa estar logado para ver seus agendamentos.
          </p>
        </div>
      </>
    )
  }

  const confirmedBookings = await getConfirmedBookings()
  const concludedBookings = await getConcludedBookings()
  const totalReservasConfirmadas = confirmedBookings.length
  const totalReservasConcluidas = concludedBookings.length
  const totalGasto = concludedBookings.reduce(
    (total, booking) => total + Number(booking.service.price),
    0,
  )

  const allBookings: Booking[] = [...confirmedBookings, ...concludedBookings]
  const barbershopsMap = new Map<string, { id: string; name: string }>()

  allBookings.forEach((booking: Booking) => {
    if (booking.service.barbershop) {
      barbershopsMap.set(booking.id, {
        id: booking.id,
        name: booking.service.barbershop.name,
      })
    }
  })

  const uniqueBarbershops = new Set(
    allBookings.map((b) => b.service.barbershop?.name).filter(Boolean),
  )
  const favoriteBarbershop = allBookings.reduce(
    (acc, booking) => {
      const name = booking.service.barbershop?.name
      if (name) {
        acc[name] = (acc[name] || 0) + 1
      }
      return acc
    },
    {} as Record<string, number>,
  )
  const mostVisited = Object.entries(favoriteBarbershop).sort(
    ([, a], [, b]) => b - a,
  )[0]

  const barbershops = Array.from(barbershopsMap.values())

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <Header specialSearchElements={barbershops} />

      <div className="mx-auto max-w-7xl">
        <div className="p-5 lg:px-8 lg:py-12">
          <div className="mb-8 lg:mb-16">
            <div className="mb-8 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="space-y-2 lg:space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-xl p-2">
                    <CalendarIcon className="text-primary h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                  <div>
                    <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-2xl font-bold lg:text-3xl lg:font-extrabold">
                      Meus Agendamentos
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      Gerencie seus horários e histórico
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {totalReservasConfirmadas + totalReservasConfirmadas > 0 && (
              <>
                {/* Stats Dashboard */}
                <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-6 lg:gap-6">
                  {/* Primary stats */}

                  <Card className="from-primary/10 to-primary/5 border-primary/20 hover:from-primary/15 hover:to-primary/10 group bg-gradient-to-br backdrop-blur-sm transition-all duration-300 lg:col-span-2">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 group-hover:bg-primary/30 rounded-xl p-3 transition-colors">
                          <ClockIcon className="text-primary h-6 w-6" />
                        </div>
                        <div>
                          <p className="text-primary text-3xl font-bold">
                            {totalReservasConfirmadas}
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            Agendamentos Confirmados
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm transition-all duration-300 hover:from-green-500/15 hover:to-green-500/10 lg:col-span-2">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-green-500/20 p-3 transition-colors group-hover:bg-green-500/30">
                          <CheckCircleIcon className="h-6 w-6 text-green-500" />
                        </div>
                        <div>
                          <p className="text-3xl font-bold text-green-500">
                            {totalReservasConcluidas}
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            Agendamentos Finalizados
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm transition-all duration-300 hover:from-yellow-500/15 hover:to-yellow-500/10 lg:col-span-2">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-yellow-500/20 p-3 transition-colors group-hover:bg-yellow-500/30">
                          <DollarSignIcon className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-500">
                            R$ {totalGasto}
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            Total Investido
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Insights Cards - Desktop only */}
                <div className="mb-8 hidden lg:grid lg:grid-cols-3 lg:gap-6">
                  <Card className="bg-card/30 hover:bg-card/50 border-0 backdrop-blur-sm transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <StarIcon className="h-5 w-5 text-yellow-500" />
                        Barbearia Favorita
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-lg font-semibold">
                        {mostVisited?.[0] || "Nenhuma ainda"}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {mostVisited
                          ? `${mostVisited[1]} visitas`
                          : "Faça seu primeiro agendamento"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 hover:bg-card/50 border-0 backdrop-blur-sm transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <MapPinIcon className="h-5 w-5 text-blue-500" />
                        Locais Visitados
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-lg font-semibold">
                        {uniqueBarbershops.size}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        {uniqueBarbershops.size === 1
                          ? "barbearia diferente"
                          : "barbearias diferentes"}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-card/30 hover:bg-card/50 border-0 backdrop-blur-sm transition-colors">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base">
                        <TrendingUpIcon className="h-5 w-5 text-green-500" />
                        Status Geral
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <p className="text-lg font-semibold">Ativo</p>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {totalReservasConfirmadas + totalReservasConcluidas}{" "}
                        agendamentos totais
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>

          <div className="space-y-3 p-5">
            {/* Empty state */}
            {totalReservasConfirmadas === 0 &&
              totalReservasConcluidas === 0 && (
                <Card className="from-card/50 to-card/30 overflow-hidden border-0 bg-gradient-to-br backdrop-blur-sm">
                  <CardContent className="relative p-8 text-center lg:p-16">
                    {/* Background decoration */}
                    <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent"></div>
                    <div className="relative z-10">
                      <div className="from-primary/20 to-primary/10 mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
                        <CalendarIcon className="text-primary h-16 w-16" />
                      </div>
                      <h3 className="mb-4 text-2xl font-bold lg:text-3xl">
                        Nenhum agendamento encontrado
                      </h3>
                      <p className="text-muted-foreground mx-auto mb-8 max-w-md lg:text-lg">
                        Você ainda não possui agendamentos. Que tal agendar seu
                        primeiro horário com os melhores barbeiros da cidade?
                      </p>
                      <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button
                          size="lg"
                          className="bg-primary hover:bg-primary/90 shadow-lg"
                          asChild
                        >
                          <Link href="/barbershops">
                            <CalendarIcon className="mr-2 h-5 w-5" />
                            Agendar Agora
                          </Link>
                        </Button>
                        <Button variant="outline" size="lg" asChild>
                          <Link href="/">Explorar Barbearias</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            {totalReservasConfirmadas === 0 &&
              totalReservasConcluidas === 0 && (
                <p className="text-gray-400">Você não tem agendamentos.</p>
              )}

            {totalReservasConfirmadas > 0 && (
              <div className="mb-12 lg:mb-20">
                <div className="mb-6 flex items-center justify-between lg:mb-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-primary/10 rounded-xl p-2">
                      <ClockIcon className="text-primary h-6 w-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold lg:text-2xl">
                        Próximos Agendamentos
                      </h2>
                      <p className="text-muted-foreground">
                        Seus horários confirmados
                      </p>
                    </div>
                  </div>
                  <Badge className="px-4 py-2 text-base font-semibold">
                    {totalReservasConfirmadas}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
                  {confirmedBookings.map((booking: Booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={JSON.parse(JSON.stringify(booking))}
                    />
                  ))}
                </div>
              </div>
            )}

            {totalReservasConcluidas > 0 && (
              <div className="mb-8 lg:mb-16">
                <div className="mb-6 flex items-center justify-between lg:mb-10">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-green-500/10 p-2">
                      <CheckCircleIcon className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold lg:text-2xl">
                        Histórico de Agendamentos
                      </h3>
                      <p className="text-muted-foreground lg:text-lg">
                        Seus serviços finalizados
                      </p>
                    </div>
                  </div>
                  <Badge className="px-4 py-2 text-base font-semibold">
                    {totalReservasConcluidas}
                  </Badge>
                </div>

                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8 xl:grid-cols-3">
                  {concludedBookings.map((booking: Booking) => (
                    <BookingItem
                      key={booking.id}
                      booking={JSON.parse(JSON.stringify(booking))}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {(totalReservasConfirmadas > 0 || totalReservasConcluidas > 0) && (
            <div className="mt-16 lg:mt-24">
              <Card className="from-primary/10 to-primary/5 border-primary/20 overflow-hidden bg-gradient-to-br backdrop-blur-sm">
                <CardContent className="relative p-8 text-center lg:p-12">
                  <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent"></div>
                  <div className="relative z-10">
                    <h3 className="mb-4 text-2xl font-bold lg:text-3xl">
                      Pronto para o próximo visual?
                    </h3>
                    <p className="text-muted-foreground mx-auto mb-8 max-w-2xl lg:text-lg">
                      Agende seu próximo horário e continue cuidando da sua
                      aparência com os melhores profissionais.
                    </p>
                    <Button
                      size="lg"
                      className="bg-primary hover:bg-primary/90 shadow-lg"
                      asChild
                    >
                      <Link href="/barbershops">
                        <CalendarIcon className="mr-2 h-5 w-5" />
                        Agendar Novo Horário
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Bookings
