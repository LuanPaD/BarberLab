import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Toaster } from "sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"
import ProgressProvider from "./_components/progress-bar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL("https://barber-lab.vercel.app/"),
  title: "Barber Lab - Sistema para Barbearias | Agendamento Online",
  description:
    "Barber Lab é o sistema ideal para barbearias. Agende horários online, encontre barbearias próximas e gerencie seus agendamentos facilmente.",
  keywords: [
    "Barber Lab",
    "sistema para barbearia",
    "agendamento barbearia",
    "barbearia online",
    "software barbearia",
    "agendar corte de cabelo",
    "barbearias próximas",
    "Barbearia",
    "Cabeleireiro",
    "barber lab",
  ],
  openGraph: {
    title: "Barber Lab - Sistema para Barbearia",
    description:
      "Encontre e agende nas melhores barbearias com o Barber Lab. Plataforma completa para clientes e barbeiros.",
    url: "https://barber-lab.vercel.app/",
    siteName: "Barber Lab",
    images: [
      {
        url: "/mobile-banner.png",
        width: 1200,
        height: 630,
        alt: "Barber Lab - Sistema para Barbearia",
      },
    ],
    locale: "pt_BR",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-br" className="dark">
      <body className={inter.className}>
        <AuthProvider>
          <ProgressProvider>
            <div className="flex h-full flex-col">
              <div className="flex-1">{children}</div>
              <Footer />
            </div>
          </ProgressProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
