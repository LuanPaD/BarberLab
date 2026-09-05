/**
 * Configuração de implantação. Só use em Server Components e Server Actions —
 * nada aqui tem prefixo `NEXT_PUBLIC_`.
 */

/**
 * Vitrine: todo usuário logado vira admin da barbearia indicada.
 * PRECISA estar desligado ao vender para um cliente real.
 */
export const DEMO_BARBERSHOP_ID = process.env.DEMO_BARBERSHOP_ID?.trim() || null
export const isDemo = process.env.DEMO_MODE === "true" && !!DEMO_BARBERSHOP_ID

/**
 * Venda unitária: quando preenchido, o sistema atende uma barbearia só.
 * A home vira a página dela, o catálogo e a busca saem de cena.
 * Vazio = catálogo com todas as barbearias (o comportamento original).
 */
export const SINGLE_BARBERSHOP_ID =
  process.env.SINGLE_BARBERSHOP_ID?.trim() || null
export const isSingleTenant = !!SINGLE_BARBERSHOP_ID

/** Segredo de exemplo que veio do repositório; não pode ir para produção. */
const SEGREDO_DE_EXEMPLO = "SKL32!@DISDNBS!"

interface Aviso {
  nivel: "erro" | "aviso"
  mensagem: string
}

/**
 * Confere as variáveis de ambiente que costumam ser esquecidas na virada para
 * produção. Devolve a lista em vez de lançar: derrubar a aplicação por causa de
 * um aviso seria pior do que o problema que ele denuncia.
 */
export const checkDeployment = (): Aviso[] => {
  const avisos: Aviso[] = []
  const emProducao = process.env.NODE_ENV === "production"

  if (emProducao && isDemo) {
    avisos.push({
      nivel: "aviso",
      mensagem:
        "DEMO_MODE está ligado em produção: qualquer usuário que fizer login vira admin da barbearia " +
        `${DEMO_BARBERSHOP_ID}. Correto só na vitrine — desligue ao vender.`,
    })
  }

  if (process.env.DEMO_MODE === "true" && !DEMO_BARBERSHOP_ID) {
    avisos.push({
      nivel: "erro",
      mensagem:
        "DEMO_MODE=true sem DEMO_BARBERSHOP_ID: o modo demonstração fica inerte e ninguém recebe acesso ao painel.",
    })
  }

  const segredo = process.env.NEXT_AUTH_SECRET ?? process.env.NEXTAUTH_SECRET
  if (!segredo) {
    avisos.push({
      nivel: "erro",
      mensagem: "NEXT_AUTH_SECRET não está definido.",
    })
  } else if (segredo === SEGREDO_DE_EXEMPLO) {
    avisos.push({
      nivel: "erro",
      mensagem:
        "NEXT_AUTH_SECRET ainda é o segredo de exemplo do repositório. Gere outro com `openssl rand -base64 32`.",
    })
  } else if (emProducao && segredo.length < 32) {
    avisos.push({
      nivel: "aviso",
      mensagem: `NEXT_AUTH_SECRET tem ${segredo.length} caracteres; o recomendado são 32 ou mais.`,
    })
  }

  if (isSingleTenant && isDemo && SINGLE_BARBERSHOP_ID !== DEMO_BARBERSHOP_ID) {
    avisos.push({
      nivel: "erro",
      mensagem:
        "SINGLE_BARBERSHOP_ID e DEMO_BARBERSHOP_ID apontam para barbearias diferentes: o visitante veria uma loja e administraria outra.",
    })
  }

  const url = process.env.NEXTAUTH_URL
  if (emProducao && (!url || url.includes("localhost"))) {
    avisos.push({
      nivel: "erro",
      mensagem: `NEXTAUTH_URL em produção está como "${url ?? "não definido"}": o login pelo Google volta para o endereço errado.`,
    })
  }

  return avisos
}
