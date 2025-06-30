import { CardContent } from "./ui/card"
import { MapPinIcon, PhoneIcon, MailIcon } from "lucide-react"
import Link from "next/link"

const Footer = () => {
  return (
    <footer className="bg-card/30 border-t backdrop-blur-sm">
      <CardContent className="px-5 py-6 lg:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          {/* Mobile layout */}
          <div className="lg:hidden">
            <p className="text-center text-sm text-gray-400">
              © 2025 Copyright <span className="font-bold">Barber Lab</span>
            </p>
          </div>

          {/* Desktop layout */}
          <div className="hidden lg:block">
            <div className="mb-8 grid grid-cols-4 gap-8">
              {/* Brand column */}
              <div className="space-y-4">
                <h3 className="text-xl font-bold">Barber Lab</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  A melhor plataforma para agendar seu horário com os melhores
                  barbeiros da cidade.
                </p>
                <div className="text-muted-foreground flex items-center gap-2 text-sm">
                  <MapPinIcon className="h-4 w-4" />
                  <span>São Paulo, SP</span>
                </div>
              </div>

              {/* Services column */}
              <div className="space-y-4">
                <h4 className="font-semibold">Serviços</h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <Link
                      href="/barbershops?service=Cabelo"
                      className="hover:text-primary transition-colors"
                    >
                      Corte de Cabelo
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/barbershops?service=Barba"
                      className="hover:text-primary transition-colors"
                    >
                      Barba
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/barbershops?service=Acabamento"
                      className="hover:text-primary transition-colors"
                    >
                      Acabamento
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/barbershops?service=Massagem"
                      className="hover:text-primary transition-colors"
                    >
                      Massagem
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Company column */}
              <div className="space-y-4">
                <h4 className="font-semibold">Empresa</h4>
                <ul className="text-muted-foreground space-y-2 text-sm">
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Sobre nós
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Carreiras
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Parceiros
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="hover:text-primary transition-colors"
                    >
                      Contato
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact column */}
              <div className="space-y-4">
                <h4 className="font-semibold">Contato</h4>
                <div className="text-muted-foreground space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="h-4 w-4" />
                    <span>(11) 99999-9999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    <span>contato@barberlab.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom section */}
            <div className="flex items-center justify-between border-t pt-8">
              <p className="text-muted-foreground text-sm">
                © 2025 <span className="font-bold">Barber Lab</span>. Todos os
                direitos reservados.
              </p>
              <p>
                Desenvolvido por{" "}
                <Link
                  className="hover:text-primary text-red-700 transition-colors"
                  href="https://www.linkedin.com/in/luan-padilha-b73054239/"
                >
                  Luan
                </Link>
              </p>
              <div className="text-muted-foreground flex items-center gap-6 text-sm">
                <Link href="#" className="hover:text-primary transition-colors">
                  Privacidade
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Termos
                </Link>
                <Link href="#" className="hover:text-primary transition-colors">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </footer>
  )
}

export default Footer
