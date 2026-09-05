"use client"

import { AlertTriangleIcon, RotateCcwIcon } from "lucide-react"
import { useEffect } from "react"
import { Button } from "@/app/_components/ui/button"
import StatusScreen, { HomeButton } from "@/app/_components/status-screen"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const AdminError = ({ error, reset }: ErrorProps) => {
  useEffect(() => {
    console.error("[erro no painel]", error.digest ?? "", error)
  }, [error])

  return (
    <StatusScreen
      icon={<AlertTriangleIcon className="h-7 w-7" />}
      eyebrow="Painel"
      title="Não foi possível carregar esta tela"
      description="A agenda e os serviços continuam salvos. Tente de novo ou volte para o site."
    >
      <Button onClick={reset}>
        <RotateCcwIcon />
        Tentar de novo
      </Button>
      <HomeButton>Voltar para o site</HomeButton>
    </StatusScreen>
  )
}

export default AdminError
