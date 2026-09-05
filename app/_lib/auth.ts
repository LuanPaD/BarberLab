import { PrismaAdapter } from "@auth/prisma-adapter"
import { Role } from "@prisma/client"
import { AuthOptions, getServerSession } from "next-auth"
import { Adapter } from "next-auth/adapters"
import GoogleProvider from "next-auth/providers/google"
import { db } from "./prisma"

// Vitrine: todo usuário logado vira admin da barbearia indicada.
const DEMO_MODE = process.env.DEMO_MODE === "true"
const DEMO_BARBERSHOP_ID = process.env.DEMO_BARBERSHOP_ID?.trim()
const isDemo = DEMO_MODE && !!DEMO_BARBERSHOP_ID

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      session.user = {
        ...session.user,
        id: user.id,
        role: isDemo ? Role.BARBER_ADMIN : (user.role ?? Role.CUSTOMER),
        barbershopId: isDemo
          ? DEMO_BARBERSHOP_ID!
          : (user.barbershopId ?? null),
      }
      return session
    },
    // Inerte com a estratégia "database"; mantido caso mude para "jwt".
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = isDemo
          ? Role.BARBER_ADMIN
          : ((user as { role?: Role }).role ?? Role.CUSTOMER)
        token.barbershopId = isDemo
          ? DEMO_BARBERSHOP_ID!
          : ((user as { barbershopId?: string | null }).barbershopId ?? null)
      }

      if (trigger === "update" && token.id) {
        const fresh = await db.user.findUnique({
          where: { id: token.id },
          select: { role: true, barbershopId: true },
        })
        if (fresh) {
          token.role = fresh.role
          token.barbershopId = fresh.barbershopId
        }
      }

      return token
    },
  },
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "database",
  },
  pages: {
    signIn: "/",
  },
  debug: false,
}

export const auth = () => getServerSession(authOptions)

export const requireBarbershopAdmin = async () => {
  const session = await auth()

  if (!session?.user || session.user.role !== Role.BARBER_ADMIN) {
    return null
  }

  if (!session.user.barbershopId) {
    return null
  }

  return {
    userId: session.user.id,
    barbershopId: session.user.barbershopId,
    name: session.user.name ?? null,
    image: session.user.image ?? null,
  }
}
