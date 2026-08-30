import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { Card, CardContent } from "@/app/_components/ui/card"
import { addMinutes, format } from "date-fns"
import { BookingStatus } from "@prisma/client"
import { CalendarDaysIcon, LockIcon } from "lucide-react"
import { redirect } from "next/navigation"
import BlockManager from "../_components/block-manager"
import DayNavigator from "../_components/day-navigator"
import EmptyState from "../_components/empty-state"
import PageHeader from "../_components/page-header"
import ScheduleCalendar from "../_components/schedule-calendar"
import { getDayAgenda } from "../_data/get-day-agenda"
import {
  BOOKING_STATUS_META,
  formatDuration,
  parseDateParam,
} from "../_lib/format"
import { cn } from "@/app/_lib/utils"

interface ScheduleProps {
  searchParams: Promise<{ date?: string }>
}

type TimelineEntry =
  | {
      kind: "booking"
      id: string
      startsAt: Date
      endsAt: Date
      title: string
      subtitle: string
      status: BookingStatus
    }
  | {
      kind: "block"
      id: string
      startsAt: Date
      endsAt: Date
      title: string
      subtitle: string
    }

const Schedule = async ({ searchParams }: ScheduleProps) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) redirect("/")

  const { date: dateParam } = await searchParams
  const date = parseDateParam(dateParam)
  const { bookings, blocks } = await getDayAgenda(admin.barbershopId, date)

  // Reservas e bloqueios entram na mesma linha do tempo, ordenados por hora.
  const timeline: TimelineEntry[] = [
    ...bookings.map<TimelineEntry>((booking) => ({
      kind: "booking",
      id: booking.id,
      startsAt: booking.date,
      endsAt: addMinutes(booking.date, booking.service.durationMinutes),
      title: booking.service.name,
      subtitle: booking.customer.name ?? booking.customer.email,
      status: booking.status,
    })),
    ...blocks.map<TimelineEntry>((block) => ({
      kind: "block",
      id: block.id,
      startsAt: block.startsAt,
      endsAt: block.endsAt,
      title: block.reason ?? "Horário bloqueado",
      subtitle: "Bloqueio manual",
    })),
  ].sort((a, b) => a.startsAt.getTime() - b.startsAt.getTime())

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-5 lg:px-8 lg:py-10">
      <PageHeader
        eyebrow="Agenda"
        title="Gestão de horários"
        description="Escolha um dia para ver a ocupação e bloquear folgas ou almoço."
        action={<DayNavigator date={date} />}
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Coluna lateral: calendário + bloqueios */}
        <div className="space-y-6 lg:col-span-5 xl:col-span-4">
          <Card>
            <CardContent className="flex justify-center p-2 sm:p-4">
              <ScheduleCalendar date={date} />
            </CardContent>
          </Card>

          <BlockManager date={date} blocks={blocks} />
        </div>

        {/* Linha do tempo do dia */}
        <div className="space-y-3 lg:col-span-7 xl:col-span-8">
          <div className="flex items-center justify-between">
            <h2 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
              {format(date, "dd/MM/yyyy")}
            </h2>
            <span className="text-muted-foreground text-xs">
              {timeline.length} {timeline.length === 1 ? "item" : "itens"}
            </span>
          </div>

          {timeline.length === 0 ? (
            <EmptyState
              icon={CalendarDaysIcon}
              title="Dia livre"
              description="Nenhum agendamento nem bloqueio nessa data."
            />
          ) : (
            <ol className="space-y-3">
              {timeline.map((entry) => {
                const isBlock = entry.kind === "block"
                const meta = isBlock ? null : BOOKING_STATUS_META[entry.status]
                const minutes = Math.round(
                  (entry.endsAt.getTime() - entry.startsAt.getTime()) / 60000,
                )

                return (
                  <li key={`${entry.kind}-${entry.id}`}>
                    <Card
                      className={cn(
                        isBlock && "bg-secondary/20 border-dashed",
                        !isBlock &&
                          entry.status === BookingStatus.CANCELED &&
                          "opacity-60",
                      )}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="w-14 shrink-0 text-center">
                          <p className="font-bold">
                            {format(entry.startsAt, "HH:mm")}
                          </p>
                          <p className="text-muted-foreground text-[11px]">
                            {formatDuration(minutes)}
                          </p>
                        </div>

                        <div
                          className={cn(
                            "h-10 w-0.5 shrink-0 rounded-full",
                            isBlock ? "bg-muted-foreground/40" : "bg-primary",
                          )}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {isBlock && (
                              <LockIcon className="text-muted-foreground h-3.5 w-3.5 shrink-0" />
                            )}
                            <p className="truncate font-semibold">
                              {entry.title}
                            </p>
                          </div>
                          <p className="text-muted-foreground truncate text-sm">
                            {entry.subtitle}
                          </p>
                        </div>

                        {meta && (
                          <span
                            className={cn(
                              "hidden shrink-0 rounded-md border px-2.5 py-0.5 text-xs font-semibold sm:inline-flex",
                              meta.className,
                            )}
                          >
                            {meta.label}
                          </span>
                        )}
                      </CardContent>
                    </Card>
                  </li>
                )
              })}
            </ol>
          )}
        </div>
      </div>
    </div>
  )
}

export default Schedule
