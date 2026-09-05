"use client"

import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react"
import { useEffect } from "react"
import { Button } from "./_components/ui/button"
import StatusScreen, { HomeButton } from "./_components/status-screen"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const ErrorBoundary = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error("[erro na rota]", error.digest ?? "", error)
  }, [error])

  return (
    <StatusScreen
      icon={<AlertTriangleIcon className="h-7 w-7" />}
      eyebrow="Erro"
      title="Algo deu errado por aqui"
      description="A página não conseguiu carregar. Tente de novo — se continuar, volte ao início e refaça o caminho."
    >
      <Button onClick={reset}>
        <RotateCcwIcon />
        Tentar de novo
      </Button>
      <HomeButton />
    </StatusScreen>
  )
}

export default ErrorBoundary
