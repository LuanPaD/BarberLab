"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar"
import { Button } from "@/app/_components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/app/_components/ui/sheet"
import { ArrowLeftIcon, LogOutIcon, MenuIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import Link from "next/link"

interface AdminTopbarProps {
  barbershopName: string
  barbershopImageUrl: string
  userName: string | null
  userImage: string | null
}

const AdminTopbar = ({
  barbershopName,
  barbershopImageUrl,
  userName,
  userImage,
}: AdminTopbarProps) => {
  const initials = (userName ?? "?").trim().charAt(0).toUpperCase()

  return (
    <header className="bg-card/95 sticky top-0 z-40 border-b backdrop-blur-sm lg:hidden">
      <div className="flex items-center justify-between gap-2 px-5 py-4">
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-9 w-9 rounded-lg">
            <AvatarImage
              src={barbershopImageUrl}
              alt={barbershopName}
              className="rounded-lg"
            />
            <AvatarFallback className="rounded-lg">
              {barbershopName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-muted-foreground text-[10px] font-medium tracking-wider uppercase">
              Painel
            </p>
            <p className="truncate text-sm font-semibold">{barbershopName}</p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button
            size="icon"
            variant="outline"
            aria-label="Voltar ao site"
            title="Voltar ao site"
            asChild
          >
            <Link href="/">
              <ArrowLeftIcon />
            </Link>
          </Button>

          <Sheet>
            <SheetTrigger asChild>
              <Button size="icon" variant="outline" aria-label="Abrir menu">
                <MenuIcon />
              </Button>
            </SheetTrigger>
            <SheetContent aria-describedby={undefined}>
              <SheetHeader>
                <SheetTitle className="text-left">Conta</SheetTitle>
              </SheetHeader>

              <div className="flex items-center gap-3 border-b border-solid py-5">
                <Avatar>
                  <AvatarImage src={userImage ?? ""} alt={userName ?? ""} />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="truncate font-bold">{userName}</p>
                  <p className="text-muted-foreground truncate text-xs">
                    {barbershopName}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 py-5">
                <SheetClose asChild>
                  <Button
                    className="justify-start gap-2"
                    variant="ghost"
                    asChild
                  >
                    <Link href="/">
                      <ArrowLeftIcon size={18} />
                      Voltar ao site
                    </Link>
                  </Button>
                </SheetClose>
                <Button
                  variant="ghost"
                  className="justify-start gap-2"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  <LogOutIcon size={18} />
                  Sair da conta
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export default AdminTopbar
