import { headers } from "next/headers"

interface Janela {
  inicio: number
  chamadas: number
}

const janelas = new Map<string, Janela>()

const LIMPEZA_A_CADA = 500
let escritasDesdeALimpeza = 0

const descartarExpiradas = (agora: number) => {
  for (const [chave, janela] of janelas) {
    if (agora - janela.inicio > 60 * 60 * 1000) janelas.delete(chave)
  }
}

interface Limite {
  chamadas: number
  porSegundos: number
}

export const LIMITES = {
  criarReserva: { chamadas: 5, porSegundos: 60 },
  leituraDeAgenda: { chamadas: 30, porSegundos: 60 },
  escritaDoPainel: { chamadas: 20, porSegundos: 60 },
} satisfies Record<string, Limite>

/**
 * Contador em memória do processo. Em serverless cada instância tem o seu, então
 * isto barra a martelada de um cliente, não um ataque distribuído — para esse
 * caso a mesma interface aceita `@upstash/ratelimit` com Redis.
 */
export const dentroDoLimite = (
  chave: string,
  { chamadas, porSegundos }: Limite,
) => {
  const agora = Date.now()

  if (++escritasDesdeALimpeza >= LIMPEZA_A_CADA) {
    escritasDesdeALimpeza = 0
    descartarExpiradas(agora)
  }

  const janela = janelas.get(chave)

  if (!janela || agora - janela.inicio >= porSegundos * 1000) {
    janelas.set(chave, { inicio: agora, chamadas: 1 })
    return { permitido: true as const }
  }

  if (janela.chamadas >= chamadas) {
    const faltam = Math.ceil(
      (janela.inicio + porSegundos * 1000 - agora) / 1000,
    )
    return { permitido: false as const, segundosParaLiberar: faltam }
  }

  janela.chamadas++
  return { permitido: true as const }
}

export const enderecoDoCliente = async () => {
  const cabecalhos = await headers()
  const encaminhado = cabecalhos.get("x-forwarded-for")
  return (
    encaminhado?.split(",")[0]?.trim() ||
    cabecalhos.get("x-real-ip") ||
    "desconhecido"
  )
}

export const erroDeLimite = (segundos: number) => ({
  ok: false as const,
  error:
    segundos > 60
      ? "Muitas tentativas. Tente de novo daqui a alguns minutos."
      : `Muitas tentativas. Tente de novo em ${segundos}s.`,
})
