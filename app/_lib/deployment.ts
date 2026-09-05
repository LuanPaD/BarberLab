// Servidor apenas: nada aqui tem prefixo NEXT_PUBLIC_.

export const DEMO_BARBERSHOP_ID = process.env.DEMO_BARBERSHOP_ID?.trim() || null
export const isDemo = process.env.DEMO_MODE === "true" && !!DEMO_BARBERSHOP_ID

export const SINGLE_BARBERSHOP_ID =
  process.env.SINGLE_BARBERSHOP_ID?.trim() || null
export const isSingleTenant = !!SINGLE_BARBERSHOP_ID

const TAMANHO_MINIMO_DO_SEGREDO = 32

interface Aviso {
  nivel: "erro" | "aviso"
  mensagem: string
}

interface Checagem {
  nivel: Aviso["nivel"]
  quandoFalha: () => boolean
  mensagem: () => string
}

const emProducao = () => process.env.NODE_ENV === "production"
const segredoDaSessao = () =>
  (process.env.NEXT_AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "").trim()

const CHECAGENS: Checagem[] = [
  {
    nivel: "erro",
    quandoFalha: () => segredoDaSessao().length === 0,
    mensagem: () =>
      "NEXT_AUTH_SECRET não está definido: o cookie de sessão fica sem assinatura.",
  },
  {
    nivel: "erro",
    quandoFalha: () => {
      const tamanho = segredoDaSessao().length
      return tamanho > 0 && tamanho < TAMANHO_MINIMO_DO_SEGREDO
    },
    mensagem: () =>
      `NEXT_AUTH_SECRET tem ${segredoDaSessao().length} caracteres, menos que os ${TAMANHO_MINIMO_DO_SEGREDO} necessários. Gere outro com \`openssl rand -base64 32\`.`,
  },
  {
    nivel: "erro",
    quandoFalha: () => process.env.DEMO_MODE === "true" && !DEMO_BARBERSHOP_ID,
    mensagem: () =>
      "DEMO_MODE=true sem DEMO_BARBERSHOP_ID: o modo demonstração fica inerte e ninguém recebe acesso ao painel.",
  },
  {
    nivel: "erro",
    quandoFalha: () =>
      isSingleTenant && isDemo && SINGLE_BARBERSHOP_ID !== DEMO_BARBERSHOP_ID,
    mensagem: () =>
      "SINGLE_BARBERSHOP_ID e DEMO_BARBERSHOP_ID apontam para barbearias diferentes: o visitante veria uma loja e administraria outra.",
  },
  {
    nivel: "erro",
    quandoFalha: () =>
      emProducao() &&
      (!process.env.NEXTAUTH_URL ||
        process.env.NEXTAUTH_URL.includes("localhost")),
    mensagem: () =>
      `NEXTAUTH_URL em produção está como "${process.env.NEXTAUTH_URL ?? "não definido"}": o login pelo Google volta para o endereço errado.`,
  },
  {
    nivel: "aviso",
    quandoFalha: () => emProducao() && isDemo,
    mensagem: () =>
      `DEMO_MODE está ligado em produção: qualquer usuário que fizer login vira admin da barbearia ${DEMO_BARBERSHOP_ID}. Correto só na vitrine — desligue ao vender.`,
  },
]

export const checkDeployment = (): Aviso[] =>
  CHECAGENS.filter((checagem) => checagem.quandoFalha()).map((checagem) => ({
    nivel: checagem.nivel,
    mensagem: checagem.mensagem(),
  }))
