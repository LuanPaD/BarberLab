import PhoneItem from "@/app/_components/phone-item"
import ServiceItem from "@/app/_components/service-item"
import SidebarSheet from "@/app/_components/sidebar-sheet"
import { Button } from "@/app/_components/ui/button"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import {
  AwardIcon,
  CalendarIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ClockIcon,
  InfoIcon,
  MapPinIcon,
  MenuIcon,
  PhoneIcon,
  StarIcon,
  UsersIcon,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getBarbershopsById } from "../../_data/get-barbershop-by-id"
import { Badge } from "@/app/_components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function BarbershopPage({ params }: any) {
  const { id } = await params
  const barbershop = await getBarbershopsById(id)
  if (!barbershop) {
    return notFound()
  }

  const openingHours = {
    monday: "08:00 - 18:00",
    tuesday: "08:00 - 18:00",
    wednesday: "08:00 - 18:00",
    thursday: "08:00 - 18:00",
    friday: "08:00 - 20:00",
    saturday: "09:00 - 16:00",
    sunday: "Fechado",
  }

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      {/* Imagem principal (Hero) */}
      <div className="relative h-[300px] w-full lg:h-[500px]">
        <Image
          alt={barbershop.name}
          src={barbershop?.imageUrl}
          fill
          sizes="100vw"
          quality={100}
          className="object-cover"
          priority={true}
        />

        {/* Sobreposição de gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Botões de navegação */}
        <div className="absolute top-4 left-4 lg:top-8 lg:left-8">
          <Button size="icon" variant="secondary" asChild>
            <Link href="/">
              <ChevronLeftIcon className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="absolute top-4 right-4 flex gap-2 lg:top-8 lg:right-8">
          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="secondary">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SidebarSheet />
          </Sheet>
        </div>

        {/* Conteúdo sobreposto na imagem principal */}
        <div className="absolute right-0 bottom-0 left-0 p-5 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <div className="text-white">
              <div className="mb-2 flex items-center gap-2">
                <Badge className="bg-primary/90 backdrop-blur-sm">
                  <StarIcon size={12} className="mr-1 fill-white text-white" />
                  {/* {barbershop.rating} */}
                  {4.9}
                </Badge>
                <Badge
                  variant="secondary"
                  className="border-white/30 bg-white/20 text-white backdrop-blur-sm"
                >
                  {/* {barbershop.reviewCount} avaliações */}
                  {70} avaliações
                </Badge>
              </div>
              <h1 className="mb-2 text-2xl font-bold lg:mb-4 lg:text-4xl">
                {barbershop.name}
              </h1>
              <div className="flex items-center gap-2 text-white/90">
                <MapPinIcon size={16} className="lg:h-5 lg:w-5" />
                <p className="text-sm lg:text-base">{barbershop?.address}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="mx-auto max-w-7xl">
        <div className="p-5 lg:px-8 lg:py-12">
          {/* Layout Desktop */}
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            {/* Coluna Esquerda - Conteúdo Principal */}
            <div className="space-y-8 lg:col-span-8">
              {/* Estatísticas rápidas - Mobile */}
              <div className="grid grid-cols-3 gap-3 lg:hidden">
                <Card className="bg-card/50 border-0 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <StarIcon className="h-5 w-5 text-yellow-500" />
                      <p className="text-lg font-bold">
                        {/* barbershop.rating */} 4.9
                      </p>
                      <p className="text-muted-foreground text-xs">Avaliação</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-0 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <UsersIcon className="h-5 w-5 text-blue-500" />
                      <p className="text-lg font-bold">
                        {/* barbershop.reviewCount */} 70
                      </p>
                      <p className="text-muted-foreground text-xs">Clientes</p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="bg-card/50 border-0 backdrop-blur-sm">
                  <CardContent className="p-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <AwardIcon className="h-5 w-5 text-green-500" />
                      <p className="text-lg font-bold">5+</p>
                      <p className="text-muted-foreground text-xs">Anos</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Seção Sobre */}
              <Card className="bg-card/30 border-0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <InfoIcon className="text-primary h-5 w-5" />
                    Sobre a Barbearia
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed lg:text-lg">
                    {barbershop?.description}
                  </p>

                  {/* Características */}
                  <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Wi-Fi Gratuito</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Estacionamento</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Cartão de Crédito</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Produtos Premium</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Ambiente Climatizado</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircleIcon className="h-4 w-4 text-green-500" />
                      <span>Profissionais Qualificados</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Seção de Serviços */}
              <Card className="bg-card/30 border-0 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <CalendarIcon className="text-primary h-5 w-5" />
                      Nossos Serviços
                    </CardTitle>
                    <Badge variant="secondary" className="px-3 py-1">
                      {barbershop.services.length} serviços
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 lg:gap-6">
                    {barbershop.services.map((service) => (
                      <ServiceItem
                        key={service.id}
                        barbershop={JSON.parse(JSON.stringify(barbershop))}
                        service={JSON.parse(JSON.stringify(service))}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Coluna Direita - Sidebar */}
            <div className="mt-8 space-y-6 lg:col-span-4 lg:mt-0">
              {/* Estatísticas rápidas - Desktop */}
              <div className="hidden lg:grid lg:grid-cols-2 lg:gap-4">
                <Card className="border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-xl bg-yellow-500/20 p-3">
                        <StarIcon className="h-6 w-6 text-yellow-500" />
                      </div>
                      <p className="text-2xl font-bold text-yellow-500">
                        {/* barbershop.rating */} 4.9
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Avaliação Média
                      </p>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm">
                  <CardContent className="p-6 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="rounded-xl bg-blue-500/20 p-3">
                        <UsersIcon className="h-6 w-6 text-blue-500" />
                      </div>
                      <p className="text-2xl font-bold text-blue-500">
                        {/* barbershop.reviewCount */} +70
                      </p>
                      <p className="text-muted-foreground text-sm">
                        Clientes Atendidos
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Horário de Funcionamento */}
              <Card className="bg-card/30 border-0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClockIcon className="text-primary h-5 w-5" />
                    Horário de Funcionamento
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {Object.entries(openingHours).map(([day, hours]) => (
                      <div
                        key={day}
                        className="border-border/50 flex items-center justify-between border-b py-2 last:border-0"
                      >
                        <span className="text-sm font-medium capitalize">
                          {day === "monday" && "Segunda-feira"}
                          {day === "tuesday" && "Terça-feira"}
                          {day === "wednesday" && "Quarta-feira"}
                          {day === "thursday" && "Quinta-feira"}
                          {day === "friday" && "Sexta-feira"}
                          {day === "saturday" && "Sábado"}
                          {day === "sunday" && "Domingo"}
                        </span>
                        <span
                          className={`text-sm ${hours === "Fechado" ? "text-red-500" : "text-muted-foreground"}`}
                        >
                          {hours}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Informações de Contato */}
              <Card className="bg-card/30 border-0 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PhoneIcon className="text-primary h-5 w-5" />
                    Contato
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {barbershop.phones.map((phone) => (
                      <PhoneItem key={phone} phone={phone} />
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Botão de CTA */}
              <Card className="from-primary/10 to-primary/5 border-primary/20 bg-gradient-to-br backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <h3 className="mb-2 flex items-center justify-center gap-2 text-lg font-semibold">
                    <CalendarIcon aria-hidden="true" />
                    Pronto para agendar?
                  </h3>
                  <p className="text-muted-foreground mb-4 text-sm">
                    Escolha um dos nossos serviços e agende seu horário
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
