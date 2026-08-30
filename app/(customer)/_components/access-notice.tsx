"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

const MESSAGES: Record<string, string> = {
  "acesso-negado": "Sua conta não tem acesso ao painel da barbearia.",
  "barbearia-nao-encontrada":
    "A barbearia vinculada à sua conta não foi encontrada.",
}

/**
 * Traduz o ?erro= usado pelos redirects do painel em um toast.
 *
 * Recebe o valor por prop (lido no servidor) em vez de usar
 * `useSearchParams`: aquele hook exigiria um <Suspense>, cuja fronteira muda
 * o formato da árvore entre servidor e cliente e desloca os ids do Radix.
 */
const AccessNotice = ({ error }: { error?: string }) => {
  const shown = useRef<string | null>(null)

  useEffect(() => {
    if (!error || shown.current === error) return
    const message = MESSAGES[error]
    if (message) {
      shown.current = error
      toast.error(message)
    }
  }, [error])

  return null
}

export default AccessNotice
