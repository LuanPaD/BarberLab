import Header from "@/app/_components/header"
import { Card, CardContent } from "@/app/_components/ui/card"
import { auth } from "@/app/_lib/auth"
import { isSingleTenant } from "@/app/_lib/deployment"
import { db } from "@/app/_lib/prisma"
import type { Metadata } from "next"
import { redirect } from "next/navigation"
import PhoneForm from "./_components/phone-form"

export const metadata: Metadata = {
  title: "Meus dados | Barber Lab",
  description: "Telefone de contato usado pela barbearia.",
  robots: { index: false, follow: false },
}

const Profile = async () => {
  const session = await auth()
  if (!session?.user?.id) redirect("/")

  const user = await db.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, phone: true },
  })

  if (!user) redirect("/")

  return (
    <div className="from-background via-background to-muted/20 min-h-svh bg-linear-to-br">
      <Header singleTenant={isSingleTenant} />

      <div className="mx-auto max-w-2xl px-5 py-10 lg:px-8 lg:py-16">
        <header className="space-y-3 border-b pb-8">
          <p className="text-primary text-[11px] font-medium tracking-wider uppercase">
            Conta
          </p>
          <h1 className="text-2xl font-bold lg:text-3xl">Meus dados</h1>
          <p className="text-muted-foreground">
            {user.name} · {user.email}
          </p>
          <p className="text-muted-foreground/70 text-xs">
            Nome, e-mail e foto vêm da sua conta Google e são alterados por lá.
          </p>
        </header>

        <Card className="mt-8">
          <CardContent className="p-5 lg:p-6">
            <PhoneForm phone={user.phone ?? ""} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
