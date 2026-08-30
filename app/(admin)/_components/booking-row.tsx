"use client"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/_components/ui/avatar"
import { Badge } from "@/app/_components/ui/badge"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import { cn } from "@/app/_lib/utils"
import { BookingStatus } from "@prisma/client"
import { addMinutes, format } from "date-fns"
import { CheckIcon, RotateCcwIcon, UserXIcon, XIcon } from "lucide-react"
import { useTransition } from "react"
import { toast } from "sonner"
import WhatsAppButton from "@/app/_components/whatsapp-button"
import { buildBarberReminderMessage } from "@/app/_lib/whatsapp"
import { updateBookingStatus } from "../_actions/update-booking-status"
import type { AgendaBooking } from "../_data/get-day-agenda"
import {
  BOOKING_STATUS_META,
  formatCurrency,
  formatDuration,
} from "../_lib/format"

interface BookingRowProps {
  booking: AgendaBooking
  barbershopName: string
  barbershopAddress: string
}

const BookingRow = ({
  booking,
  barbershopName,
  barbershopAddress,
}: BookingRowProps) => {
  const [isPending, startTransition] = useTransition()
  const meta = BOOKING_STATUS_META[booking.status]
  const endsAt = addMinutes(booking.date, booking.service.durationMinutes)
  const customerName = booking.customer.name ?? booking.customer.email
  const isClosed = booking.status !== BookingStatus.CONFIRMED

  const changeStatus = (status: BookingStatus, successMessage: string) => {
    startTransition(async () => {
      const result = await updateBookingStatus({
        bookingId: booking.id,
        status,
      })
      if (result.ok) {
        toast.success(successMessage)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <Card
      className={cn(
        "transition-opacity",
        isPending && "pointer-events-none opacity-60",
        booking.status === BookingStatus.CANCELED && "opacity-60",
      )}
    >
      <CardContent className="flex flex-col gap-4 p-0 sm:flex-row">
        {/* Faixa de horário */}
        <div className="bg-secondary/40 flex shrink-0 items-center gap-3 px-5 py-3 sm:w-[104px] sm:flex-col sm:items-center sm:justify-center sm:gap-0.5 sm:rounded-l-xl sm:px-4 sm:py-5">
          <p className="text-xl font-bold sm:text-2xl">
            {format(booking.date, "HH:mm")}
          </p>
          <p className="text-muted-foreground text-xs">
            até {format(endsAt, "HH:mm")}
          </p>
        </div>

        {/* Dados do atendimento */}
        <div className="min-w-0 flex-1 space-y-3 px-5 pb-5 sm:py-5 sm:pl-0">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("w-fit", meta.className)}>
              {meta.label}
            </Badge>
            <span className="text-muted-foreground text-xs">
              {formatDuration(booking.service.durationMinutes)} ·{" "}
              {formatCurrency(booking.service.price)}
            </span>
          </div>

          <div>
            <h3 className="truncate font-semibold">{booking.service.name}</h3>
            <div className="mt-2 flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage
                  src={booking.customer.image ?? ""}
                  alt={customerName}
                />
                <AvatarFallback className="text-[10px]">
                  {customerName.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <p className="text-muted-foreground truncate text-sm">
                {customerName}
              </p>
            </div>
          </div>

          {/* Ações */}
          <div className="flex flex-wrap gap-2">
            <WhatsAppButton
              size="sm"
              variant="outline"
              phone={booking.customer.phone}
              label="Lembrete"
              fallbackLabel="Lembrete"
              message={buildBarberReminderMessage({
                serviceName: booking.service.name,
                date: booking.date,
                barbershopName,
                barbershopAddress,
                customerName: booking.customer.name,
              })}
            />
            {isClosed ? (
              <Button
                size="sm"
                variant="ghost"
                disabled={isPending}
                onClick={() =>
                  changeStatus(BookingStatus.CONFIRMED, "Atendimento reaberto.")
                }
              >
                <RotateCcwIcon />
                Reabrir
              </Button>
            ) : (
              <>
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() =>
                    changeStatus(
                      BookingStatus.COMPLETED,
                      "Atendimento concluído.",
                    )
                  }
                >
                  <CheckIcon />
                  Concluir
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={isPending}
                  onClick={() =>
                    changeStatus(BookingStatus.NO_SHOW, "Marcado como falta.")
                  }
                >
                  <UserXIcon />
                  Faltou
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-destructive hover:text-destructive"
                  disabled={isPending}
                  onClick={() =>
                    changeStatus(
                      BookingStatus.CANCELED,
                      "Agendamento cancelado.",
                    )
                  }
                >
                  <XIcon />
                  Cancelar
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default BookingRow
