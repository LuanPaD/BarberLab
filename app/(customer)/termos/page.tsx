import type { Metadata } from "next"
import InstitutionalPage, {
  Section,
} from "@/app/(customer)/_components/institutional-page"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Termos de Uso | Barber Lab",
  description:
    "Regras de uso do Barber Lab: o que a plataforma faz, o que é responsabilidade da barbearia e o que se espera de quem agenda.",
}

const Termos = () => {
  return (
    <InstitutionalPage
      eyebrow="Legal"
      title="Termos de Uso"
      description="As regras de quem usa a plataforma, de um lado e do outro do balcão."
      updatedAt="5 de setembro de 2026"
    >
      <Section title="O que o Barber Lab é">
        <p>
          Uma plataforma que conecta clientes a barbearias para marcação de
          horários. Não somos uma barbearia e não prestamos o serviço de
          barbearia: quem atende, define preço, cumpre horário e responde pela
          qualidade é o estabelecimento.
        </p>
      </Section>

      <Section title="Conta de acesso">
        <p>
          O acesso é feito com uma conta Google. Você é responsável por manter
          essa conta segura e pelos agendamentos feitos por ela. Se identificar
          uso indevido, avise pelo{" "}
          <Link href="/contato" className="text-primary hover:underline">
            contato
          </Link>
          .
        </p>
      </Section>

      <Section title="Agendamentos e cancelamentos">
        <p>
          O horário marcado é um compromisso com a barbearia. Você pode cancelar
          pela plataforma enquanto o atendimento não tiver acontecido — mas
          cancelar em cima da hora, ou não aparecer, pode fazer a barbearia
          recusar novos agendamentos seus.
        </p>
        <p>
          A barbearia pode cancelar ou bloquear horários por motivo próprio,
          como folga, imprevisto ou fechamento. Quando isso acontecer, ela é
          responsável por avisar você.
        </p>
      </Section>

      <Section title="Pagamento">
        <p>
          Os atendimentos são pagos presencialmente, direto com a barbearia. O
          Barber Lab não processa pagamentos, não retém valores e não participa
          de cobranças, reembolsos ou disputas financeiras entre você e o
          estabelecimento.
        </p>
      </Section>

      <Section title="Obrigações da barbearia parceira">
        <p>
          Manter serviços, preços e duração atualizados; manter a agenda
          condizente com o funcionamento real; honrar os horários confirmados; e
          tratar os dados dos clientes apenas para a finalidade do atendimento.
        </p>
      </Section>

      <Section title="Uso indevido">
        <p>
          É proibido usar a plataforma para agendamentos falsos, automatizar
          requisições, tentar acessar dados de outros usuários ou prejudicar o
          funcionamento do sistema. Contas nessas situações podem ser suspensas.
        </p>
      </Section>

      <Section title="Limitação de responsabilidade">
        <p>
          Trabalhamos para manter a plataforma disponível, mas ela pode ficar
          indisponível por manutenção ou falha técnica. Não respondemos pelo
          atendimento prestado pela barbearia nem por prejuízos decorrentes de
          horário não cumprido pelo estabelecimento.
        </p>
      </Section>

      <Section title="Alterações e foro">
        <p>
          Estes termos podem mudar; a data no topo indica a última versão. Ao
          continuar usando a plataforma depois de uma alteração, você concorda
          com a versão vigente. Aplica-se a legislação brasileira.
        </p>
      </Section>
    </InstitutionalPage>
  )
}

export default Termos
