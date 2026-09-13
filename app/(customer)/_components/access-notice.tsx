"use client"

import { useEffect, useRef } from "react"
import { toast } from "sonner"

const MESSAGES: Record<string, string> = {
  "acesso-negado": "Sua conta não tem acesso ao painel da barbearia.",
  "barbearia-nao-encontrada":
    "A barbearia vinculada à sua conta não foi encontrada.",
}

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
