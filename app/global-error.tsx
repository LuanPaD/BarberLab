"use client"

import { useEffect } from "react"
import "./globals.css"

interface GlobalErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

const GlobalError = ({ error, reset }: GlobalErrorProps) => {
  useEffect(() => {
    console.error("[erro no layout raiz]", error.digest ?? "", error)
  }, [error])

  return (
    <html lang="pt-br" className="dark">
      <body className="bg-background text-foreground flex min-h-svh flex-col items-center justify-center px-5 text-center">
        <h1 className="text-2xl font-bold">O sistema não conseguiu abrir</h1>
        <p className="text-muted-foreground mt-3 max-w-md text-sm">
          Houve uma falha ao carregar o Barber Lab. Recarregue a página; se o
          problema continuar, tente novamente em alguns minutos.
        </p>
        {error.digest && (
          <p className="text-muted-foreground/60 mt-4 font-mono text-xs">
            Código: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="bg-primary text-primary-foreground mt-8 rounded-md px-4 py-2 text-sm font-medium"
        >
          Recarregar
        </button>
      </body>
    </html>
  )
}

export default GlobalError
