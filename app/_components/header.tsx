"use client"

import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MenuIcon, SearchIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"
import UserMenu from "./user-menu"
import { searchInputRef } from "./search"
import React from "react"

interface HeaderProps {
  specialSearchElements?: { id: string; name: string }[]
}

const referenciaDoComponenteInput = searchInputRef

const Header: React.FC<HeaderProps> = ({ specialSearchElements = [] }) => {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [showSearch, setShowSearch] = React.useState(false)

  const handleSpecialSearch = React.useCallback(
    (searchTerm: string) => {
      if (!specialSearchElements || specialSearchElements.length === 0) return

      if (searchTerm === "") {
        specialSearchElements.forEach((el) => {
          document.getElementById(el.id)?.classList.remove("hidden")
        })
        return
      }

      specialSearchElements.forEach((el) => {
        const element = document.getElementById(el.id)
        if (element) {
          element.classList.toggle(
            "hidden",
            !el.name.toLowerCase().includes(searchTerm),
          )
        }
      })
    },
    [specialSearchElements],
  )

  React.useEffect(() => {
    handleSpecialSearch(searchTerm)
  }, [searchTerm, handleSpecialSearch])

  const handleSearchClick = () => {
    const inputEncontradoNaPaginaAtual = referenciaDoComponenteInput.current

    if (inputEncontradoNaPaginaAtual) {
      referenciaDoComponenteInput?.current?.focus()
      return
    }

    setShowSearch(true)
  }

  return (
    <Card className="bg-card/95 sticky top-0 z-50 border-b backdrop-blur-sm">
      <CardContent className="flex flex-row items-center justify-between p-5 lg:px-8 lg:py-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            alt="Barber Lab"
            src="/logo.png"
            priority
            height={18}
            width={120}
            className="lg:h-8 lg:w-auto"
          />
        </Link>

        {/* Navegação Desktop */}
        <nav className="hidden lg:flex lg:items-center lg:gap-8">
          <Link
            href="/"
            className="text-foreground hover:text-primary group relative text-sm font-medium transition-colors"
          >
            Início
            <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/barbershops"
            className="text-foreground hover:text-primary group relative text-sm font-medium transition-colors"
          >
            Barbearias
            <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"></span>
          </Link>
          <Link
            href="/bookings"
            className="text-foreground hover:text-primary group relative text-sm font-medium transition-colors"
          >
            Agendamentos
            <span className="bg-primary absolute -bottom-1 left-0 h-0.5 w-0 transition-all group-hover:w-full"></span>
          </Link>
        </nav>

        {/* Ações Desktop */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          {/* Botão de pesquisa que abre um input ao lado */}
          <div className="relative flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-primary/10"
              onClick={handleSearchClick}
              aria-label="Pesquisar"
              type="button"
            >
              <SearchIcon className="h-5 w-5" />
            </Button>

            {showSearch && (
              <input
                type="text"
                className="border-input bg-background focus:ring-primary rounded border px-3 py-1 text-sm transition-all duration-200 focus:ring-2 focus:outline-none"
                placeholder="Pesquisar..."
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value.toLowerCase())}
                onBlur={() => {
                  if (!searchTerm) {
                    setShowSearch(false)
                    setSearchTerm("")
                  }
                }}
              />
            )}
          </div>

          <UserMenu />

          <Button className="bg-primary hover:bg-primary/50" asChild>
            <Link href="/barbershops?tag=recomendados">Agendar</Link>
          </Button>
        </div>

        {/* Botão do menu mobile */}
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="outline" className="lg:hidden">
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SidebarSheet />
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
