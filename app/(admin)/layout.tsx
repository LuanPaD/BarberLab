import { auth, requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import AdminSidebar from "./_components/admin-sidebar"
import AdminTabBar from "./_components/admin-tabbar"
import AdminTopbar from "./_components/admin-topbar"

export const metadata: Metadata = {
  title: "Painel | Barber Lab",
  description:
    "Gerencie a agenda, os serviços e os atendimentos da sua barbearia.",
  robots: { index: false, follow: false },
}

/**
 * A casca fica montada aqui, em Server Component, e cada peça interativa é um
 * client component folha. Envolver `children` num client component desloca o
 * contexto de árvore do `useId` entre o SSR e a hidratação, e os ids do Radix
 * (aria-controls do Sheet) saíam diferentes dos dois lados.
 */
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const admin = await requireBarbershopAdmin()

  // Sem sessão vai para a home (onde fica o diálogo de login); logado mas sem
  // permissão também volta para a home — não existe painel para ele.
  if (!admin) {
    const session = await auth()
    redirect(session?.user ? "/?erro=acesso-negado" : "/")
  }

  const barbershop = await db.barbershop.findUnique({
    where: { id: admin.barbershopId },
    select: { name: true, imageUrl: true },
  })

  // O vínculo existe na sessão mas a barbearia sumiu do banco.
  if (!barbershop) {
    redirect("/?erro=barbearia-nao-encontrada")
  }

  const identity = {
    barbershopName: barbershop.name,
    barbershopImageUrl: barbershop.imageUrl,
    userName: admin.name,
    userImage: admin.image,
  }

  return (
    <div className="min-h-full">
      <AdminSidebar {...identity} />
      <AdminTopbar {...identity} />

      <main className="pb-24 lg:pb-0 lg:pl-64">{children}</main>

      <AdminTabBar />
    </div>
  )
}

export default AdminLayout
