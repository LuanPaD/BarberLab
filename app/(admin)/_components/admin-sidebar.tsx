"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar"
import { Button } from "@/app/_components/ui/button"
import { cn } from "@/app/_lib/utils"
import { ArrowLeftIcon, LogOutIcon } from "lucide-react"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { ADMIN_NAV_ITEMS } from "./admin-nav"

interface AdminSidebarProps {
  barbershopName: string
  barbershopImageUrl: string
  userName: string | null
  userImage: string | null
}

const AdminSidebar = ({
  barbershopName,
  barbershopImageUrl,
  userName,
  userImage,
}: AdminSidebarProps) => {
  const pathname = usePathname()
  const initials = (userName ?? "?").trim().charAt(0).toUpperCase()

  return (
    <aside className="bg-card fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r lg:flex">
      <div className="flex h-[73px] items-center border-b px-6">
        <Link href="/" className="flex items-center gap-2">
          <Image
            alt="Barber Lab"
            src="/logo.png"
            height={18}
            width={120}
            priority
            className="h-auto w-auto"
          />
        </Link>
      </div>

      <div className="border-b px-4 py-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-10 w-10 rounded-lg">
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
              Painel do barbeiro
            </p>
            <p className="truncate text-sm font-semibold">{barbershopName}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {ADMIN_NAV_ITEMS.map((item) => {
          const Icon = item.icon
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              data-tour={item.tour}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <span
                className={cn(
                  "bg-primary absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r transition-opacity",
                  active ? "opacity-100" : "opacity-0",
                )}
              />
              <Icon className="h-4 w-4 shrink-0" />
              <span className="flex-1">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="space-y-1 border-t p-3">
        <div className="flex items-center gap-3 rounded-lg px-3 py-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage ?? ""} alt={userName ?? ""} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <p className="truncate text-sm font-medium">{userName}</p>
        </div>
        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start gap-3"
          asChild
        >
          <Link href="/">
            <ArrowLeftIcon className="h-4 w-4" />
            Voltar ao site
          </Link>
        </Button>
        <Button
          variant="ghost"
          className="text-muted-foreground w-full justify-start gap-3"
          onClick={() => signOut({ callbackUrl: "/" })}
        >
          <LogOutIcon className="h-4 w-4" />
          Sair da conta
        </Button>
      </div>
    </aside>
  )
}

export default AdminSidebar
