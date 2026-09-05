import { auth, requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import AdminSidebar from "./_components/admin-sidebar"
import AdminTabBar from "./_components/admin-tabbar"
import AdminTopbar from "./_components/admin-topbar"
import OnboardingTour from "./_components/onboarding-tour"

export const metadata: Metadata = {
  title: "Painel | Barber Lab",
  description:
    "Gerencie a agenda, os serviços e os atendimentos da sua barbearia.",
  robots: { index: false, follow: false },
}

// A casca fica em Server Component e cada peça interativa é client folha:
// envolver `children` num client component quebrava a hidratação do Radix.
const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
  const admin = await requireBarbershopAdmin()

  if (!admin) {
    const session = await auth()
    redirect(session?.user ? "/?erro=acesso-negado" : "/")
  }

  const [barbershop, user] = await Promise.all([
    db.barbershop.findUnique({
      where: { id: admin.barbershopId },
      select: { name: true, imageUrl: true },
    }),
    db.user.findUnique({
      where: { id: admin.userId },
      select: { onboardingDoneAt: true },
    }),
  ])

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

      {!user?.onboardingDoneAt && <OnboardingTour />}
    </div>
  )
}

export default AdminLayout
