import Image from "next/image"
import { Card, CardContent } from "./ui/card"
import { Button } from "./ui/button"
import { MenuIcon, SearchIcon, UserIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Link from "next/link"

const Header = () => {
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
            style={{ height: "auto", width: "auto" }}
            className="lg:h-8 lg:w-auto"
          />
        </Link>

        {/* Desktop Navigation - hidden on mobile */}
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

        {/* Desktop Actions - hidden on mobile */}
        <div className="hidden lg:flex lg:items-center lg:gap-4">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <SearchIcon className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10">
            <UserIcon className="h-5 w-5" />
          </Button>
          <Button className="bg-primary hover:bg-primary/90">Agendar</Button>
        </div>

        {/* Mobile Menu Button - hidden on desktop */}
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
