import Header from "./_components/header"
import { Button } from "./_components/ui/button"
import Image from "next/image"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"
import { quickSearchOptions } from "./_constants/search"
import BookingItem from "./_components/booking-item"
import Search from "./_components/search"
import Link from "next/link"
import { getServerSession } from "next-auth"
import { authOptions } from "./_lib/auth"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { getConfirmedBookings } from "./_data/get-confirmed-bookings"
import {
  CalendarIcon,
  MapPinIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react"

const Home = async () => {
  const session = await getServerSession(authOptions)
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })
  const confirmedBookings = await getConfirmedBookings()

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* cabeçalho */}
      <Header />

      {/* Conteúdo principal com container responsivo */}
      <div className="mx-auto max-w-7xl">
        <div className="p-5 lg:px-8 lg:py-12">
          {/* Seção hero - layout desktop aprimorado */}
          <div className="lg:grid lg:min-h-[500px] lg:grid-cols-12 lg:items-center lg:gap-12">
            {/* Coluna esquerda - Texto e Busca */}
            <div className="lg:col-span-7 lg:pr-8">
              {/* Seção de boas-vindas */}
              <div className="space-y-4 lg:space-y-6">
                <div className="space-y-2">
                  <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-xl font-bold lg:text-5xl lg:leading-tight lg:font-extrabold">
                    Olá, {session?.user ? session.user.name : "bem vindo"}!
                  </h1>
                  <div className="text-muted-foreground flex items-center gap-2 lg:text-xl">
                    <CalendarIcon className="h-4 w-4 lg:h-5 lg:w-5" />
                    <p>
                      <span className="capitalize">
                        {format(new Date(), "EEEE, dd", { locale: ptBR })}
                      </span>
                      <span>&nbsp;de&nbsp;</span>
                      <span className="capitalize">
                        {format(new Date(), "MMMM", { locale: ptBR })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Cartões de estatísticas (desktop) */}
                <div className="hidden lg:my-8 lg:grid lg:grid-cols-3 lg:gap-4">
                  <div className="bg-card/50 hover:bg-card/70 rounded-xl border p-4 backdrop-blur-sm transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <StarIcon className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">4.9</p>
                        <p className="text-muted-foreground text-sm">
                          Avaliação média
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card/50 hover:bg-card/70 rounded-xl border p-4 backdrop-blur-sm transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <MapPinIcon className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">50+</p>
                        <p className="text-muted-foreground text-sm">
                          Barbearias
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-card/50 hover:bg-card/70 rounded-xl border p-4 backdrop-blur-sm transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 rounded-lg p-2">
                        <TrendingUpIcon className="text-primary h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold">1k+</p>
                        <p className="text-muted-foreground text-sm">
                          Agendamentos
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Seção de busca */}
              <div className="mt-6 lg:mt-8">
                <div className="lg:bg-card/30 lg:rounded-2xl lg:border lg:p-6 lg:backdrop-blur-sm">
                  <h3 className="mb-4 hidden text-lg font-semibold lg:block">
                    Encontre sua barbearia ideal
                  </h3>
                  <Search />
                </div>
              </div>

              {/* Busca rápida */}
              <div className="mt-6 lg:mt-8">
                <h3 className="text-muted-foreground mb-4 hidden text-sm font-medium tracking-wider uppercase lg:block">
                  Serviços populares
                </h3>
                <div className="flex gap-3 overflow-x-scroll lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible [&::-webkit-scrollbar]:hidden">
                  {quickSearchOptions.map((option) => (
                    <Button
                      className="shrink-0 gap-2 transition-transform hover:scale-105 lg:h-12 lg:shrink lg:justify-start lg:text-base"
                      variant="secondary"
                      key={option.title}
                      asChild
                    >
                      <Link href={`/barbershops?service=${option.title}`}>
                        <Image
                          src={option.imageUrl}
                          width={16}
                          height={16}
                          alt={option.title}
                          className="lg:h-5 lg:w-5"
                        />
                        {option.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna direita */}
            <div className="mt-6 lg:col-span-5 lg:mt-0">
              <div className="group relative h-[150px] w-full overflow-hidden lg:h-[400px] lg:rounded-3xl">
                {/* Mobile image */}
                <Image
                  alt="Agende nos melhores com Barber Lab"
                  src="/banner-01.png"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105 lg:hidden"
                />

                {/* Desktop image */}
                <Image
                  alt="Agende nos melhores com Barber Lab"
                  src="/desktop-banner.png"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  priority
                  className="hidden object-cover transition-transform duration-700 group-hover:scale-105 lg:block"
                />

                {/* Sobreposição com gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent lg:opacity-80" />

                {/* Conteúdo sobreposto (desktop) */}
                <div className="absolute right-6 bottom-6 left-6 hidden text-white lg:block">
                  <h3 className="mb-2 text-2xl font-bold">
                    Agende com os melhores
                  </h3>
                  <p className="mb-4 text-white/90">
                    Profissionais qualificados e ambiente moderno
                  </p>
                  <Button className="bg-white text-black hover:bg-white/90">
                    Ver barbearias
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Seção de agendamentos */}
          {confirmedBookings.length > 0 && (
            <div className="mt-12 lg:mt-20">
              <div className="mb-6 flex items-center gap-3 lg:mb-8">
                <CalendarIcon className="text-primary h-5 w-5 lg:h-6 lg:w-6" />
                <h2 className="lg:text-foreground text-xs font-bold text-gray-400 uppercase lg:text-lg lg:font-semibold lg:normal-case">
                  Seus Agendamentos
                </h2>
              </div>

              <div className="flex gap-3 overflow-x-auto lg:grid lg:grid-cols-2 lg:gap-6 lg:overflow-visible xl:grid-cols-3 [&::-webkit-scrollbar]:hidden">
                {confirmedBookings.map((booking) => (
                  <BookingItem key={booking.id} booking={booking} />
                ))}
              </div>
            </div>
          )}

          {/* Seção recomendados */}
          <div className="mt-12 lg:mt-20">
            <div className="mb-6 flex items-center justify-between lg:mb-8">
              <div className="flex items-center gap-3">
                <StarIcon className="text-primary h-5 w-5 lg:h-6 lg:w-6" />
                <h2 className="lg:text-foreground text-xs font-bold text-gray-400 uppercase lg:text-lg lg:font-semibold lg:normal-case">
                  Recomendados para você
                </h2>
              </div>
              <Button variant="ghost" className="hidden lg:flex" asChild>
                <Link href="/barbershops?tag=recomendados">Ver todos</Link>
              </Button>
            </div>

            <div className="flex gap-4 overflow-auto lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible xl:grid-cols-4 2xl:grid-cols-5 [&::-webkit-scrollbar]:hidden">
              {barbershops.slice(0, 8).map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          </div>

          {/* Seção populares */}
          <div className="mt-12 lg:mt-20 lg:mb-12">
            <div className="mb-6 flex items-center justify-between lg:mb-8">
              <div className="flex items-center gap-3">
                <TrendingUpIcon className="text-primary h-5 w-5 lg:h-6 lg:w-6" />
                <h2 className="lg:text-foreground text-xs font-bold text-gray-400 uppercase lg:text-lg lg:font-semibold lg:normal-case">
                  Mais populares
                </h2>
              </div>
              <Button variant="ghost" className="hidden lg:flex" asChild>
                <Link href="/barbershops?tag=popular">Ver todos</Link>
              </Button>
            </div>

            <div className="flex gap-4 overflow-auto lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible xl:grid-cols-4 2xl:grid-cols-5 [&::-webkit-scrollbar]:hidden">
              {popularBarbershops.slice(0, 8).map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
