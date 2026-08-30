"use client"

import { Role } from "@prisma/client"
import { LayoutDashboardIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

/**
 * Atalho para o painel, visível só para quem administra uma barbearia.
 * É conveniência de navegação — o controle de acesso real está no
 * layout de (admin) e em cada Server Action.
 *
 * O SessionProvider não recebe sessão no servidor, então só renderizamos
 * depois de montar. Sem isso o servidor manda um nó a menos que o cliente e
 * os ids do Radix logo abaixo saem trocados (erro de hidratação). Mesmo
 * motivo da flag `mounted` em user-menu.tsx.
 */
const AdminPanelLink = ({ className }: { className?: string }) => {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || session?.user?.role !== Role.BARBER_ADMIN) return null

  return (
    <Button variant="secondary" className={className} asChild>
      <Link href="/dashboard">
        <LayoutDashboardIcon size={18} />
        Painel da barbearia
      </Link>
    </Button>
  )
}

export default AdminPanelLink
