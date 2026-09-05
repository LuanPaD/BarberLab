import { isDemo } from "@/app/_lib/deployment"
import { FlaskConicalIcon } from "lucide-react"

const DemoBanner = () => {
  if (!isDemo) return null

  return (
    <div className="bg-primary/10 text-primary border-primary/20 flex items-center justify-center gap-2 border-b px-4 py-2 text-center text-xs">
      <FlaskConicalIcon className="h-3.5 w-3.5 shrink-0" />
      <p>
        <span className="font-semibold">Modo demonstração</span> — todo
        visitante recebe acesso ao painel do barbeiro.
      </p>
    </div>
  )
}

export default DemoBanner
