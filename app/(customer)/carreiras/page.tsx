import type { Metadata } from "next"
import InstitutionalPage, {
  Section,
} from "@/app/(customer)/_components/institutional-page"
import { Button } from "@/app/_components/ui/button"
import { MailIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Carreiras | Barber Lab",
  description:
    "O Barber Lab não tem vagas abertas no momento, mas aceita candidaturas espontâneas.",
}

const Carreiras = () => {
  return (
    <InstitutionalPage
      eyebrow="Trabalhe conosco"
      title="Carreiras"
      description="Somos um time pequeno construindo um produto para barbearias de bairro."
    >
      <Section title="Vagas abertas">
        <p>
          <strong className="text-foreground">
            Não temos vagas abertas no momento.
          </strong>{" "}
          Preferimos dizer isso do que manter uma lista desatualizada e receber
          candidaturas para posições que não existem.
        </p>
      </Section>

      <Section title="Candidatura espontânea">
        <p>
          Se você trabalha com produto, design ou desenvolvimento e o problema
          que resolvemos te interessa, mande um e-mail contando o que você faz e
          o que gostaria de construir aqui. Guardamos o contato e chamamos
          quando abrir algo compatível.
        </p>
        <Button variant="outline" className="mt-2 w-full sm:w-auto" asChild>
          <a href="mailto:lptech.contato.labs@gmail.com?subject=Candidatura%20espont%C3%A2nea">
            <MailIcon />
            Enviar candidatura
          </a>
        </Button>
      </Section>

      <Section title="É barbeiro?">
        <p>
          O Barber Lab não contrata barbeiros nem intermedeia contratação — quem
          contrata é cada barbearia. Se você procura trabalho como barbeiro,
          fale direto com os estabelecimentos listados na plataforma.
        </p>
      </Section>
    </InstitutionalPage>
  )
}

export default Carreiras
