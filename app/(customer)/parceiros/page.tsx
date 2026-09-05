import type { Metadata } from "next"
import InstitutionalPage, {
  Section,
} from "@/app/(customer)/_components/institutional-page"
import { Button } from "@/app/_components/ui/button"
import { MessageCircleIcon } from "lucide-react"

export const metadata: Metadata = {
  title: "Parceiros | Barber Lab",
  description:
    "Como sua barbearia entra no Barber Lab: o que é preciso, o que está incluído e como funciona a implantação.",
}

const Parceiros = () => {
  return (
    <InstitutionalPage
      eyebrow="Para barbearias"
      title="Seja um parceiro"
      description="Sua barbearia recebe agendamentos online e um painel para administrar a agenda."
    >
      <Section title="O que está incluído">
        <p>
          Página própria da barbearia com endereço, telefone e catálogo de
          serviços; agendamento online para os seus clientes; e um painel com a
          agenda do dia, marcação de atendimento concluído ou falta, bloqueio de
          horários e cadastro de serviços com preço e duração.
        </p>
      </Section>

      <Section title="O que você precisa ter">
        <p>
          Um e-mail para acessar o painel, a lista dos serviços com preço e
          tempo médio de cada um, e o telefone de contato da barbearia. Fotos
          dos serviços ajudam, mas não são obrigatórias.
        </p>
      </Section>

      <Section title="Como funciona a implantação">
        <p>
          Cadastramos a barbearia, os serviços e o horário de funcionamento
          junto com você. A partir daí a agenda é sua: quem inclui, altera e
          bloqueia horário é a barbearia, pelo painel.
        </p>
      </Section>

      <Section title="Pagamento dos atendimentos">
        <p>
          Os atendimentos continuam sendo pagos presencialmente, direto com
          você. Não retemos valores, não cobramos comissão por agendamento e não
          entramos na relação financeira com o seu cliente.
        </p>
      </Section>

      <Section title="Quero conversar">
        <Button className="mt-2 w-full sm:w-auto" asChild>
          <a
            href={`https://wa.me/5514996674489?text=${encodeURIComponent(
              "Olá! Tenho uma barbearia e quero ser parceiro do Barber Lab.",
            )}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircleIcon />
            Falar no WhatsApp
          </a>
        </Button>
      </Section>
    </InstitutionalPage>
  )
}

export default Parceiros
