"use client"

import { Barbershop, BarbershopService } from "@prisma/client"
import Image from "next/image"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { ptBR } from "date-fns/locale"
import { useEffect, useMemo, useState } from "react"
import { addMinutes, isPast, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  getUnavailableIntervals,
  type UnavailableInterval,
} from "../_actions/get-bookings"
import { Dialog, DialogContent } from "./ui/dialog"
import SignInDialog from "./sign-in-dialog"
import BookingSummary from "./booking-summary"
import {
  buildCustomerConfirmationMessage,
  buildWhatsAppUrl,
} from "../_lib/whatsapp"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "name" | "phones">
}

const TIME_LIST = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
]

interface GetTimeListProps {
  intervals: UnavailableInterval[]
  selectedDay: Date
  durationMinutes: number
}

/**
 * Um horário só aparece se o atendimento inteiro couber nele: comparamos
 * [início, início + duração) com as faixas ocupadas — reservas e bloqueios.
 * Antes bastava não haver reserva começando naquele minuto exato.
 */
const getTimeList = ({
  intervals,
  selectedDay,
  durationMinutes,
}: GetTimeListProps) => {
  return TIME_LIST.filter((time) => {
    const [hours, minutes] = time.split(":").map(Number)
    const startsAt = set(selectedDay, {
      hours,
      minutes,
      seconds: 0,
      milliseconds: 0,
    })

    if (isPast(startsAt)) return false

    const endsAt = addMinutes(startsAt, durationMinutes)

    return !intervals.some(
      (interval) =>
        startsAt < new Date(interval.endsAt) &&
        endsAt > new Date(interval.startsAt),
    )
  })
}

const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const { data } = useSession()
  const [signInDialogIsOpen, setSignInDialogIsOpen] = useState(false)
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [unavailable, setUnavailable] = useState<UnavailableInterval[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const intervals = await getUnavailableIntervals({
        date: selectedDay,
        serviceId: service.id,
      })
      setUnavailable(intervals)
    }
    fetch()
  }, [selectedDay, service.id])

  const selectedDate = useMemo(() => {
    if (!selectedDay || !selectedTime) return
    return set(selectedDay, {
      hours: Number(selectedTime?.split(":")[0]),
      minutes: Number(selectedTime?.split(":")[1]),
    })
  }, [selectedDay, selectedTime])

  const handleBookingClick = () => {
    if (data?.user) {
      return setBookingSheetIsOpen(true)
    }
    return setSignInDialogIsOpen(true)
  }

  const handleBookingSheetOpenChange = () => {
    setSelectedDay(undefined)
    setSelectedTime(undefined)
    setUnavailable([])
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDate) return
      const result = await createBooking({
        serviceId: service.id,
        date: selectedDate,
      })

      if (!result.ok) {
        toast.error(result.error)
        return
      }

      handleBookingSheetOpenChange()

      const whatsappUrl = buildWhatsAppUrl({
        phone: barbershop.phones?.[0],
        message: buildCustomerConfirmationMessage({
          serviceName: service.name,
          date: selectedDate,
          barbershopName: barbershop.name,
          customerName: data?.user?.name,
          price: Number(service.price),
        }),
      })

      // Uma ação só: com duas o toast do sonner espreme a coluna de texto.
      // "Ver agendamentos" continua acessível pelo menu, e a reserva também
      // traz o botão de WhatsApp na tela de detalhes.
      toast.success("Reserva criada com sucesso!", {
        description: "Confirme com a barbearia pelo WhatsApp.",
        duration: 10000,
        action: {
          label: "Confirmar",
          onClick: () => window.open(whatsappUrl, "_blank"),
        },
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao criar reserva!")
    }
  }

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      intervals: unavailable,
      selectedDay,
      durationMinutes: service.durationMinutes,
    })
  }, [unavailable, selectedDay, service.durationMinutes])

  return (
    <>
      <Card>
        <CardContent className="flex items-center gap-3 p-3">
          {/* IMAGE */}
          <div className="relative max-h-[110px] min-h-[110px] max-w-[110px] min-w-[110px]">
            <Image
              alt={service.name || "Serviço"}
              src={service.imageUrl}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="rounded-lg object-cover"
            />
          </div>
          {/* DIREITA */}
          <div className="flex flex-1 flex-col space-y-2">
            <h3 className="text-sm font-semibold">{service.name}</h3>
            <p className="text-sm text-gray-400">{service.description}</p>
            {/* PREÇO E BOTÃO */}
            <div className="flex items-center justify-between">
              <p className="text-primary text-sm font-bold">
                {Intl.NumberFormat("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                }).format(Number(service.price))}
              </p>
              <div className="flex-1" />
              <Sheet
                open={bookingSheetIsOpen}
                onOpenChange={(open) => {
                  if (!open) handleBookingSheetOpenChange()
                }}
              >
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleBookingClick}
                  className="ml-auto px-4 py-2 text-xs sm:text-sm md:text-base lg:px-6 lg:py-3"
                >
                  Reservar
                </Button>

                <SheetContent className="px-0" aria-describedby={undefined}>
                  <SheetHeader className="flex items-center">
                    <SheetTitle className="flex items-center">
                      Fazer Reserva
                    </SheetTitle>
                  </SheetHeader>

                  <div className="border-b border-solid px-5 py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      disabled={(date: Date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                      className="w-full"
                      styles={{
                        root: {
                          width: "100%",
                        },
                        table: {
                          width: "100%",
                        },
                        head_cell: {
                          width: "100%",
                          textTransform: "capitalize",
                        },
                        cell: {
                          width: "100%",
                        },
                        button: {
                          width: "100%",
                        },
                        nav_button_previous: {
                          width: "32px",
                          height: "32px",
                        },
                        nav_button_next: {
                          width: "32px",
                          height: "32px",
                        },
                        caption: {
                          textTransform: "capitalize",
                        },
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="flex gap-3 overflow-x-auto border-b border-solid p-5 [&::-webkit-scrollbar]:hidden">
                      {timeList.length > 0 ? (
                        timeList.map((time) => (
                          <Button
                            key={time}
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            className="rounded-full"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))
                      ) : (
                        <p className="text-xs">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
                    </div>
                  )}

                  {selectedDate && (
                    <div className="p-5">
                      <BookingSummary
                        barbershop={barbershop}
                        service={service}
                        selectedDate={selectedDate}
                      />
                    </div>
                  )}
                  <SheetFooter className="mt-5 px-5">
                    <Button
                      onClick={handleCreateBooking}
                      disabled={!selectedDay || !selectedTime}
                    >
                      Confirmar
                    </Button>
                  </SheetFooter>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog
        open={signInDialogIsOpen}
        onOpenChange={(open) => setSignInDialogIsOpen(open)}
      >
        <DialogContent className="w-[90%]">
          <SignInDialog />
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServiceItem
