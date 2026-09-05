import type { Metadata } from "next"
import InstitutionalPage, {
  Section,
} from "@/app/(customer)/_components/institutional-page"
import { Button } from "@/app/_components/ui/button"
import { MailIcon, MessageCircleIcon } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Contato | Barber Lab",
  description:
    "Fale com o Barber Lab sobre suporte, contratação do sistema para sua barbearia ou dúvidas sobre agendamentos.",
}

const CONTATO_EMAIL = "contato@barberlab.com.br"
const CONTATO_WHATSAPP = "5514996674489"

const Contato = () => {
  return (
    <InstitutionalPage
      eyebrow="Fale conosco"
      title="Contato"
      description="Escolha o canal conforme o assunto — assim a resposta chega mais rápido."
    >
      <Section title="Sua barbearia quer usar o sistema">
        <p>
          Chame no WhatsApp. Explicamos como funciona, mostramos o painel e
          configuramos sua barbearia com os serviços e horários que você já
          pratica.
        </p>
        <Button className="mt-2 w-full sm:w-auto" asChild>
          <a
            href={`https://wa.me/${CONTATO_WHATSAPP}?text=${encodeURIComponent(
              "Olá! Quero saber mais sobre o Barber Lab para a minha barbearia.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleIcon />
            Falar no WhatsApp
          </a>
        </Button>
      </Section>

      <Section title="Você é cliente e tem um problema com um agendamento">
        <p>
          Fale direto com a barbearia: o telefone dela fica na página do
          estabelecimento e nos detalhes da sua reserva. Quem controla a agenda,
          os horários e os cancelamentos é a barbearia, não o Barber Lab.
        </p>
      </Section>

      <Section title="Suporte, privacidade e dados">
        <p>
          Para falhas no sistema, pedidos sobre seus dados pessoais ou qualquer
          assunto relacionado à{" "}
          <Link href="/privacidade" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
          , use o e-mail abaixo. Respondemos em até 5 dias úteis.
        </p>
        <Button variant="outline" className="mt-2 w-full sm:w-auto" asChild>
          <a href={`mailto:${CONTATO_EMAIL}`}>
            <MailIcon />
            {CONTATO_EMAIL}
          </a>
        </Button>
      </Section>
    </InstitutionalPage>
  )
}

export default Contato
