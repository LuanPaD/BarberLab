"use client"

import { Button } from "@/app/_components/ui/button"
import { addDays, isToday } from "date-fns"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import { toDateParam } from "../_lib/format"

interface DayNavigatorProps {
  date: Date
}

const DayNavigator = ({ date }: DayNavigatorProps) => {
  const router = useRouter()
  const pathname = usePathname()

  const goTo = (target: Date) =>
    router.push(`${pathname}?date=${toDateParam(target)}`)

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        size="icon"
        aria-label="Dia anterior"
        onClick={() => goTo(addDays(date, -1))}
      >
        <ChevronLeftIcon />
      </Button>

      <div className="bg-card/50 min-w-0 flex-1 rounded-lg border px-4 py-2 text-center sm:min-w-[190px] sm:flex-none">
        {/* first-letter em vez de capitalize: o capitalize do Tailwind
            deixaria "Segunda-Feira, 30 De Junho". Formato curto no mobile
            porque o nome completo do dia não cabe e vinha cortado. */}
        <p className="text-sm font-semibold first-letter:uppercase sm:hidden">
          {format(date, "EEE, dd 'de' MMM", { locale: ptBR })}
        </p>
        <p className="hidden text-sm font-semibold first-letter:uppercase sm:block">
          {format(date, "EEEE, dd 'de' MMMM", { locale: ptBR })}
        </p>
      </div>

      <Button
        variant="outline"
        size="icon"
        aria-label="Próximo dia"
        onClick={() => goTo(addDays(date, 1))}
      >
        <ChevronRightIcon />
      </Button>

      {!isToday(date) && (
        <Button variant="secondary" onClick={() => goTo(new Date())}>
          Hoje
        </Button>
      )}
    </div>
  )
}

export default DayNavigator
