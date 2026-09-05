import type { Metadata } from "next"
import InstitutionalPage, {
  Section,
} from "@/app/(customer)/_components/institutional-page"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Política de Cookies | Barber Lab",
  description:
    "Quais cookies o Barber Lab usa, para que servem e como desativá-los no seu navegador.",
}

const Cookies = () => {
  return (
    <InstitutionalPage
      eyebrow="Legal"
      title="Política de Cookies"
      description="Usamos o mínimo necessário para você continuar conectado e para medir desempenho."
      updatedAt="5 de setembro de 2026"
    >
      <Section title="O que são cookies">
        <p>
          Arquivos pequenos que um site guarda no seu navegador para lembrar
          informações entre uma página e outra — por exemplo, que você já fez
          login.
        </p>
      </Section>

      <Section title="Cookies que usamos">
        <p>
          <strong className="text-foreground">De sessão (necessários):</strong>{" "}
          criados na autenticação para manter você conectado. Sem eles não é
          possível acessar seus agendamentos nem o painel da barbearia. Expiram
          ao sair da conta ou ao fim do prazo da sessão.
        </p>
        <p>
          <strong className="text-foreground">De desempenho:</strong> o Vercel
          Speed Insights mede tempo de carregamento das páginas de forma
          agregada, para encontrarmos telas lentas. Não identificam você
          individualmente.
        </p>
        <p>
          Não usamos cookies de publicidade, rastreamento entre sites ou
          compartilhamento com redes de anúncios.
        </p>
      </Section>

      <Section title="Cookies de terceiros">
        <p>
          A autenticação é feita pelo Google, que define os próprios cookies
          durante o login, conforme a política de privacidade dele. Não temos
          acesso nem controle sobre esses cookies.
        </p>
      </Section>

      <Section title="Como desativar">
        <p>
          Todo navegador permite bloquear ou apagar cookies nas configurações.
          Vale saber que, bloqueando os cookies de sessão, o login deixa de
          funcionar e você não conseguirá agendar.
        </p>
      </Section>

      <Section title="Mais informações">
        <p>
          O tratamento dos seus dados pessoais está descrito na{" "}
          <Link href="/privacidade" className="text-primary hover:underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </Section>
    </InstitutionalPage>
  )
}

export default Cookies
