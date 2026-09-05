"use client"

import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"
import { Switch } from "@/app/_components/ui/switch"
import { WEEKDAY_LABELS } from "@/app/_lib/opening-hours"
import { cn } from "@/app/_lib/utils"
import { SaveIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { saveOpeningHours } from "../_actions/opening-hours"
import type { OpeningHoursInput } from "../_lib/opening-hours-schema"

interface OpeningHoursFormProps {
  hours: OpeningHoursInput
}

const OpeningHoursForm = ({ hours }: OpeningHoursFormProps) => {
  const [dias, setDias] = useState(hours)
  const [isSaving, startSaving] = useTransition()

  const atualizar = (weekday: number, campo: Partial<OpeningHoursInput[0]>) =>
    setDias((atual) =>
      atual.map((d) => (d.weekday === weekday ? { ...d, ...campo } : d)),
    )

  const salvar = () =>
    startSaving(async () => {
      const result = await saveOpeningHours(dias)
      if (result.ok) {
        toast.success("Horário de funcionamento salvo.")
      } else {
        toast.error(result.error)
      }
    })

  return (
    <Card>
      <CardContent className="space-y-4 p-4 lg:p-6">
        <ul className="space-y-3">
          {dias.map((dia) => (
            <li
              key={dia.weekday}
              className={cn(
                "flex flex-col gap-3 border-b pb-3 last:border-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between",
                dia.isClosed && "opacity-60",
              )}
            >
              <div className="flex items-center justify-between gap-3 sm:w-48">
                <span className="text-sm font-medium">
                  {WEEKDAY_LABELS[dia.weekday]}
                </span>
                <Switch
                  checked={!dia.isClosed}
                  onCheckedChange={(aberto) =>
                    atualizar(dia.weekday, { isClosed: !aberto })
                  }
                  aria-label={`${WEEKDAY_LABELS[dia.weekday]}: ${
                    dia.isClosed ? "fechado" : "aberto"
                  }`}
                />
              </div>

              {dia.isClosed ? (
                <span className="text-muted-foreground text-sm">Fechado</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Input
                    type="time"
                    className="w-32"
                    value={dia.opensAt}
                    aria-label={`Abre em ${WEEKDAY_LABELS[dia.weekday]}`}
                    onChange={(e) =>
                      atualizar(dia.weekday, { opensAt: e.target.value })
                    }
                  />
                  <span className="text-muted-foreground text-sm">até</span>
                  <Input
                    type="time"
                    className="w-32"
                    value={dia.closesAt}
                    aria-label={`Fecha em ${WEEKDAY_LABELS[dia.weekday]}`}
                    onChange={(e) =>
                      atualizar(dia.weekday, { closesAt: e.target.value })
                    }
                  />
                </div>
              )}
            </li>
          ))}
        </ul>

        <Button
          onClick={salvar}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          <SaveIcon />
          {isSaving ? "Salvando..." : "Salvar horários"}
        </Button>
      </CardContent>
    </Card>
  )
}

export default OpeningHoursForm
