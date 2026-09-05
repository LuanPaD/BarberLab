import type { Metadata } from "next"
import InstitutionalPage, {
  Section,
} from "@/app/(customer)/_components/institutional-page"

export const metadata: Metadata = {
  title: "Sobre nós | Barber Lab",
  description:
    "O Barber Lab é um sistema de agendamento para barbearias: o cliente marca online e o barbeiro administra a agenda, os serviços e os atendimentos num painel próprio.",
}

const Sobre = () => {
  return (
    <InstitutionalPage
      eyebrow="Quem somos"
      title="Sobre o Barber Lab"
      description="Um sistema de agendamento feito para barbearias que ainda anotam horário no caderno ou no WhatsApp."
    >
      <Section title="O problema que resolvemos">
        <p>
          A maior parte das barbearias controla a agenda por mensagem. O
          barbeiro para no meio de um corte para responder, esquece de anotar,
          marca dois clientes no mesmo horário e perde tempo confirmando
          presença um a um.
        </p>
        <p>
          O Barber Lab tira esse trabalho do caminho: o cliente escolhe serviço,
          dia e horário sozinho, e a barbearia enxerga o dia inteiro numa tela.
        </p>
      </Section>

      <Section title="Como funciona">
        <p>
          <strong className="text-foreground">Para o cliente:</strong> encontra
          a barbearia, vê os serviços com preço e duração, escolhe um horário
          livre e confirma. Depois acompanha os agendamentos e cancela quando
          precisar.
        </p>
        <p>
          <strong className="text-foreground">Para a barbearia:</strong> um
          painel com a agenda do dia, faturamento previsto, marcação de
          atendimento concluído ou falta, bloqueio de horários para folga e
          almoço, e cadastro de serviços com preço e tempo de cadeira.
        </p>
      </Section>

      <Section title="Pagamento presencial">
        <p>
          O pagamento continua sendo feito na barbearia, como sempre foi. Não
          intermediamos valores nem cobramos taxa por agendamento — o sistema
          organiza a agenda, não o caixa.
        </p>
      </Section>

      <Section title="Confirmação pelo WhatsApp">
        <p>
          A confirmação e os lembretes usam links diretos do WhatsApp, abertos
          no aparelho de quem clica. Não conectamos o número da barbearia a
          nenhuma API não oficial, justamente para não colocar a conta em risco
          de bloqueio.
        </p>
      </Section>
    </InstitutionalPage>
  )
}

export default Sobre
