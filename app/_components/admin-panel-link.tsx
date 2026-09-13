"use client"

import { Role } from "@prisma/client"
import { LayoutDashboardIcon } from "lucide-react"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"

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
