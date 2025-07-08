import Link from "next/link"
import BarbershopItem from "../_components/barbershop-item"
import Header from "../_components/header"
import Search from "../_components/search"
import { Button } from "../_components/ui/button"
import { Card, CardContent } from "../_components/ui/card"
import { getBarbershopsBySearchParams } from "../_data/getBarbershopsBySearchParams"
import {
  FilterIcon,
  GridIcon,
  ListIcon,
  MapPinIcon,
  SearchIcon,
  SortAscIcon,
  StarIcon,
  TrendingUpIcon,
} from "lucide-react"

interface BarbershopsPageProps {
  searchParams: {
    title?: string
    service?: string
    tag?: "recomendados" | "popular"
  }
}

export default async function BarbershopsPage({
  searchParams,
}: BarbershopsPageProps) {
  searchParams = await sanitizeSearchParams(searchParams)

  const barbershops = await getBarbershopsBySearchParams(searchParams)
  const searchTerm =
    searchParams?.title ||
    searchParams?.service ||
    searchParams?.tag ||
    "todas as barbearias"
  const totalResults = barbershops.length

  return (
    <div className="from-background via-background to-muted/20 min-h-screen bg-gradient-to-br">
      <Header />

      {/* Conteúdo principal */}
      <div className="mx-auto max-w-7xl">
        <div className="p-5 lg:px-8 lg:py-12">
          {/* Seção Hero */}
          <div className="mb-8 lg:mb-16">
            {/* Cabeçalho e estatísticas */}
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
              <div className="space-y-2 lg:space-y-4">
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <Link
                    href="/"
                    className="hover:text-primary transition-colors"
                  >
                    Início
                  </Link>
                  <span>/</span>
                  <span>Barbearias</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 rounded-xl p-2">
                    <SearchIcon className="text-primary h-6 w-6 lg:h-8 lg:w-8" />
                  </div>
                  <div>
                    <h1 className="from-foreground to-foreground/70 bg-gradient-to-r bg-clip-text text-2xl font-bold lg:text-3xl lg:font-extrabold">
                      Encontre sua Barbearia
                    </h1>
                    <p className="text-muted-foreground mt-1">
                      {totalResults} barbearias encontradas
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de ação no desktop */}
              <div className="hidden lg:flex lg:items-center lg:gap-4">
                <Button variant="outline" className="gap-2">
                  <FilterIcon className="h-4 w-4" />
                  Filtros
                </Button>
                <Button variant="outline" className="gap-2">
                  <SortAscIcon className="h-4 w-4" />
                  Ordenar
                </Button>
                <div className="bg-card/50 flex items-center gap-2 rounded-lg border p-1 backdrop-blur-sm">
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <GridIcon className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <ListIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Seção de busca */}
            <div className="mb-8 lg:mb-12">
              <Card className="bg-card/30 overflow-hidden border-0 backdrop-blur-sm">
                <CardContent className="p-6 lg:p-8">
                  <div className="space-y-4 lg:space-y-6">
                    <div className="text-center lg:text-left">
                      <h3 className="mb-2 text-lg font-semibold lg:text-xl">
                        Refine sua busca
                      </h3>
                      <p className="text-muted-foreground">
                        Encontre exatamente o que você procura
                      </p>
                    </div>
                    <Search />
                  </div>
                </CardContent>
              </Card>
            </div>

            {barbershops.length > 0 && (
              <>
                {/* Estatísticas e filtros rápidos */}
                <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-6">
                  <Card className="from-primary/10 to-primary/5 border-primary/20 hover:from-primary/15 hover:to-primary/10 group bg-gradient-to-br backdrop-blur-sm transition-all duration-300">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 group-hover:bg-primary/30 rounded-xl p-3 transition-colors">
                          <SearchIcon className="text-primary h-5 w-5 lg:h-6 lg:w-6" />
                        </div>
                        <div>
                          <p className="text-primary text-2xl font-bold lg:text-3xl">
                            {totalResults}
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            Barbearias
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 to-yellow-500/5 backdrop-blur-sm transition-all duration-300 hover:from-yellow-500/15 hover:to-yellow-500/10">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-yellow-500/20 p-3 transition-colors group-hover:bg-yellow-500/30">
                          <StarIcon className="h-5 w-5 text-yellow-500 lg:h-6 lg:w-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-yellow-500 lg:text-3xl">
                            4.8
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            Avaliação
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group border-green-500/20 bg-gradient-to-br from-green-500/10 to-green-500/5 backdrop-blur-sm transition-all duration-300 hover:from-green-500/15 hover:to-green-500/10">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-green-500/20 p-3 transition-colors group-hover:bg-green-500/30">
                          <MapPinIcon className="h-5 w-5 text-green-500 lg:h-6 lg:w-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-green-500 lg:text-3xl">
                            5
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            Regiões
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="group border-blue-500/20 bg-gradient-to-br from-blue-500/10 to-blue-500/5 backdrop-blur-sm transition-all duration-300 hover:from-blue-500/15 hover:to-blue-500/10">
                    <CardContent className="p-4 lg:p-6">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-500/20 p-3 transition-colors group-hover:bg-blue-500/30">
                          <TrendingUpIcon className="h-5 w-5 text-blue-500 lg:h-6 lg:w-6" />
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-blue-500 lg:text-3xl">
                            98%
                          </p>
                          <p className="text-muted-foreground text-sm font-medium">
                            Satisfação
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </div>

          {/* Seção de resultados */}
          <div className="space-y-6 lg:space-y-8">
            {/* Cabeçalho dos resultados */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold lg:text-2xl">
                  Resultados para &quot;{searchTerm}&quot;
                </h2>
                <p className="text-muted-foreground text-sm lg:text-base">
                  {totalResults}{" "}
                  {totalResults === 1
                    ? "barbearia encontrada"
                    : "barbearias encontradas"}
                </p>
              </div>

              {/* Botões de filtro no mobile */}
              <div className="flex items-center gap-2 lg:hidden">
                <Button variant="outline" size="sm" className="gap-1">
                  <FilterIcon className="h-3 w-3" />
                  Filtros
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <SortAscIcon className="h-3 w-3" />
                  Ordenar
                </Button>
              </div>
            </div>

            {/* Estado vazio */}
            {barbershops.length === 0 && (
              <Card className="from-card/50 to-card/30 overflow-hidden border-0 bg-gradient-to-br backdrop-blur-sm">
                <CardContent className="relative p-8 text-center lg:p-16">
                  <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent"></div>
                  <div className="relative z-10">
                    <div className="from-primary/20 to-primary/10 mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br shadow-lg">
                      <SearchIcon className="text-primary h-16 w-16" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold lg:text-3xl">
                      Nenhuma barbearia encontrada
                    </h3>
                    <p className="text-muted-foreground mx-auto mb-8 max-w-md lg:text-lg">
                      Não encontramos barbearias com os critérios de pesquisa
                      &quot;{searchTerm}&quot;. Tente ajustar os filtros ou
                      buscar por outros termos.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 shadow-lg"
                        asChild
                      >
                        <Link href="/barbershops">Ver Todas as Barbearias</Link>
                      </Button>
                      <Button variant="outline" size="lg" asChild>
                        <Link href="/">Voltar ao Início</Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Grid de resultados */}
            {barbershops.length > 0 && (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {barbershops.map((barbershop) => (
                  <div key={barbershop.id} className="group">
                    <BarbershopItem barbershop={barbershop} />
                  </div>
                ))}
              </div>
            )}

            {/* Seção Carregar Mais */}
            {barbershops.length > 0 && (
              <div className="mt-12 text-center lg:mt-16">
                <Card className="bg-card/30 inline-block border-0 backdrop-blur-sm">
                  <CardContent className="p-6 lg:p-8">
                    <div className="space-y-4">
                      <p className="text-muted-foreground">
                        Mostrando {barbershops.length} de {barbershops.length}{" "}
                        barbearias
                      </p>
                      <div className="flex flex-col justify-center gap-4 sm:flex-row">
                        <Button variant="outline" size="lg">
                          Carregar Mais
                        </Button>
                        <Button variant="ghost" size="lg" asChild>
                          <Link href="/">Voltar ao Início</Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Chamada para ação */}
            <div className="mt-16 lg:mt-24">
              <Card className="from-primary/10 to-primary/5 border-primary/20 overflow-hidden bg-gradient-to-br backdrop-blur-sm">
                <CardContent className="relative p-8 text-center lg:p-12">
                  <div className="from-primary/5 absolute inset-0 bg-gradient-to-br to-transparent"></div>
                  <div className="relative z-10">
                    <h3 className="mb-4 text-2xl font-bold lg:text-3xl">
                      Não encontrou o que procurava?
                    </h3>
                    <p className="text-muted-foreground mx-auto mb-8 max-w-2xl lg:text-lg">
                      Entre em contato conosco para sugerir novas barbearias ou
                      serviços. Estamos sempre expandindo nossa rede de
                      parceiros.
                    </p>
                    <div className="flex flex-col justify-center gap-4 sm:flex-row">
                      <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 shadow-lg"
                      >
                        Sugerir Barbearia
                      </Button>
                      <Button variant="outline" size="lg">
                        Falar Conosco
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const sanitizeSearchParams = async (
  searchParams: BarbershopsPageProps["searchParams"],
): Promise<BarbershopsPageProps["searchParams"]> => {
  searchParams =
    searchParams instanceof Promise ? await searchParams : searchParams
  if (!searchParams || Object.keys(searchParams).length === 0) {
    return { tag: "popular" }
  }

  const { title, service, tag } = searchParams

  return {
    ...(title ? { title: title.trim() } : {}),
    ...(service ? { service: service.trim() } : {}),
    ...(tag === "recomendados" || tag === "popular" ? { tag } : {}),
  }
}
