import { requireBarbershopAdmin } from "@/app/_lib/auth"
import { db } from "@/app/_lib/prisma"
import { format, isToday } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  BanknoteIcon,
  CalendarCheckIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  LockIcon,
  UserXIcon,
} from "lucide-react"
import { redirect } from "next/navigation"
import BookingRow from "../_components/booking-row"
import DayNavigator from "../_components/day-navigator"
import EmptyState from "../_components/empty-state"
import PageHeader from "../_components/page-header"
import StatCard from "../_components/stat-card"
import { getDayAgenda, summarizeAgenda } from "../_data/get-day-agenda"
import { formatCurrency, formatDuration, parseDateParam } from "../_lib/format"

interface DashboardProps {
  searchParams: Promise<{ date?: string }>
}

const Dashboard = async ({ searchParams }: DashboardProps) => {
  const admin = await requireBarbershopAdmin()
  if (!admin) redirect("/")

  const { date: dateParam } = await searchParams
  const date = parseDateParam(dateParam)

  const [{ bookings, blocks }, barbershop] = await Promise.all([
    getDayAgenda(admin.barbershopId, date),
    db.barbershop.findUnique({
      where: { id: admin.barbershopId },
      select: { name: true, address: true },
    }),
  ])
  const summary = summarizeAgenda(bookings)
  const firstName = admin.name?.split(" ")[0] ?? "barbeiro"

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-5 lg:px-8 lg:py-10">
      <PageHeader
        eyebrow={isToday(date) ? "Hoje" : "Visão do dia"}
        title={
          isToday(date)
            ? `Olá, ${firstName}!`
            : format(date, "dd 'de' MMMM", { locale: ptBR })
        }
        description={
          isToday(date)
            ? "Este é o resumo do seu dia."
            : "Veja como ficou (ou vai ficar) esse dia."
        }
        action={<DayNavigator date={date} />}
      />

      {/* Métricas */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        <StatCard
          label="Agendamentos"
          value={String(summary.total)}
          hint={
            summary.bookedMinutes > 0
              ? `${formatDuration(summary.bookedMinutes)} de cadeira`
              : undefined
          }
          icon={CalendarCheckIcon}
          tone="primary"
        />
        <StatCard
          label="Faturamento previsto"
          value={formatCurrency(summary.revenue)}
          hint="Cancelados não contam"
          icon={BanknoteIcon}
          tone="primary"
        />
        <StatCard
          label="Concluídos"
          value={String(summary.completed)}
          icon={CheckCircle2Icon}
        />
        <StatCard
          label="Faltas e cancelamentos"
          value={String(summary.missed)}
          icon={UserXIcon}
          tone={summary.missed > 0 ? "warning" : "default"}
        />
      </div>

      {/* Bloqueios do dia */}
      {blocks.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Bloqueios
          </h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {blocks.map((block) => (
              <div
                key={block.id}
                className="bg-secondary/30 flex items-center gap-3 rounded-lg border border-dashed px-4 py-3"
              >
                <LockIcon className="text-muted-foreground h-4 w-4 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium">
                    {format(block.startsAt, "HH:mm")} –{" "}
                    {format(block.endsAt, "HH:mm")}
                  </p>
                  <p className="text-muted-foreground truncate text-xs">
                    {block.reason ?? "Horário bloqueado"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Agenda do dia */}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
            Atendimentos do dia
          </h2>
          {bookings.length > 0 && (
            <span className="text-muted-foreground text-xs">
              {bookings.length}{" "}
              {bookings.length === 1 ? "atendimento" : "atendimentos"}
            </span>
          )}
        </div>

        {bookings.length === 0 ? (
          <EmptyState
            icon={CalendarDaysIcon}
            title="Nenhum atendimento nesse dia"
            description="Quando um cliente agendar, ele aparece aqui com as ações de concluir, falta e cancelamento."
          />
        ) : (
          <div className="space-y-3">
            {bookings.map((booking) => (
              <BookingRow
                key={booking.id}
                booking={booking}
                barbershopName={barbershop?.name ?? ""}
                barbershopAddress={barbershop?.address ?? ""}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Dashboard
