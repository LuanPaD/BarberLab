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

            <p>
              {" "}
              Desenvolvido por <span className="font-bold">Luan</span>
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
                    <span>(14) 99667-4489</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MailIcon className="h-4 w-4" />
                    <span>luanpmiranda@gmail.com</span>
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
                  className="hover:text-primary flex items-center text-[#0077B5] transition-colors"
                  href="https://www.linkedin.com/in/luan-padilha-b73054239/"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={16}
                    height={16}
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.968v5.699h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.599v5.597z" />
                  </svg>
                  <span className="ml-2 font-bold">Luan</span>
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
