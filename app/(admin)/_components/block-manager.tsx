"use client"

import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/app/_components/ui/dialog"
import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { format } from "date-fns"
import { LockIcon, PlusIcon, Trash2Icon } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  createScheduleBlock,
  deleteScheduleBlock,
} from "../_actions/schedule-blocks"
import type { AgendaBlock } from "../_data/get-day-agenda"
import { toDateParam } from "../_lib/format"

interface BlockManagerProps {
  date: Date
  blocks: AgendaBlock[]
}

const PRESETS = [
  { label: "Almoço", startTime: "12:00", endTime: "13:00", reason: "Almoço" },
  {
    label: "Dia inteiro",
    startTime: "00:00",
    endTime: "23:59",
    reason: "Folga",
  },
]

const BlockManager = ({ date, blocks }: BlockManagerProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [startTime, setStartTime] = useState("12:00")
  const [endTime, setEndTime] = useState("13:00")
  const [reason, setReason] = useState("")
  const [isPending, startTransition] = useTransition()

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setStartTime(preset.startTime)
    setEndTime(preset.endTime)
    setReason(preset.reason)
  }

  const handleCreate = () => {
    startTransition(async () => {
      const result = await createScheduleBlock({
        date: toDateParam(date),
        startTime,
        endTime,
        reason: reason.trim() || undefined,
      })

      if (result.ok) {
        toast.success("Horário bloqueado.")
        setIsOpen(false)
        setReason("")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDelete = (blockId: string) => {
    startTransition(async () => {
      const result = await deleteScheduleBlock(blockId)
      if (result.ok) {
        toast.success("Bloqueio removido.")
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <LockIcon className="text-muted-foreground h-4 w-4" />
            <h2 className="text-sm font-semibold">Bloqueios do dia</h2>
          </div>

          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button size="sm" variant="secondary">
                <PlusIcon />
                Bloquear
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[90%] max-w-md">
              <DialogHeader>
                <DialogTitle>Bloquear horário</DialogTitle>
                <DialogDescription>
                  O intervalo fica indisponível para novos agendamentos em{" "}
                  {format(date, "dd/MM/yyyy")}.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((preset) => (
                    <Button
                      key={preset.label}
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => applyPreset(preset)}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="block-start">Início</Label>
                    <Input
                      id="block-start"
                      type="time"
                      value={startTime}
                      onChange={(event) => setStartTime(event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="block-end">Fim</Label>
                    <Input
                      id="block-end"
                      type="time"
                      value={endTime}
                      onChange={(event) => setEndTime(event.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="block-reason">Motivo (opcional)</Label>
                  <Input
                    id="block-reason"
                    placeholder="Almoço, folga, curso..."
                    value={reason}
                    maxLength={120}
                    onChange={(event) => setReason(event.target.value)}
                  />
                </div>
              </div>

              <DialogFooter className="flex flex-row gap-3">
                <DialogClose asChild>
                  <Button variant="secondary" className="w-full">
                    Voltar
                  </Button>
                </DialogClose>
                <Button
                  className="w-full"
                  onClick={handleCreate}
                  disabled={isPending}
                >
                  Bloquear
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {blocks.length === 0 ? (
          <p className="text-muted-foreground text-sm">
            Nenhum bloqueio nesse dia.
          </p>
        ) : (
          <ul className="space-y-2">
            {blocks.map((block) => (
              <li
                key={block.id}
                className="bg-secondary/30 flex items-center justify-between gap-3 rounded-lg border border-dashed px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {format(block.startsAt, "HH:mm")} –{" "}
                    {format(block.endsAt, "HH:mm")}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {block.reason ?? "Horário bloqueado"}
                  </p>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-destructive hover:text-destructive shrink-0"
                  aria-label="Remover bloqueio"
                  disabled={isPending}
                  onClick={() => handleDelete(block.id)}
                >
                  <Trash2Icon />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}

export default BlockManager
