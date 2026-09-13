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
import { useEffect, useMemo, useState, useTransition } from "react"
import { addMinutes, isPast, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import {
  getServiceOpeningHours,
  getUnavailableIntervals,
  type UnavailableInterval,
} from "../_actions/get-bookings"
import {
  buildDaySlots,
  findDayHours,
  isClosedOn,
  type OpeningHourSlot,
} from "../_lib/opening-hours"
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

interface GetTimeListProps {
  intervals: UnavailableInterval[]
  selectedDay: Date
  durationMinutes: number
  openingHours: OpeningHourSlot[]
}

const getTimeList = ({
  intervals,
  selectedDay,
  durationMinutes,
  openingHours,
}: GetTimeListProps) => {
  const doDia = findDayHours(openingHours, selectedDay)

  return buildDaySlots(doDia, durationMinutes).filter((time) => {
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
  const [openingHours, setOpeningHours] = useState<OpeningHourSlot[]>([])
  const [bookingSheetIsOpen, setBookingSheetIsOpen] = useState(false)
  const [isLoadingSlots, setIsLoadingSlots] = useState(false)
  const [isCreating, startCreating] = useTransition()

  useEffect(() => {
    if (!selectedDay) return

    let current = true
    setIsLoadingSlots(true)

    const load = async () => {
      const [intervals, hours] = await Promise.all([
        getUnavailableIntervals({ date: selectedDay, serviceId: service.id }),
        getServiceOpeningHours(service.id),
      ])
      if (!current) return
      setUnavailable(intervals)
      setOpeningHours(hours)
      setIsLoadingSlots(false)
    }

    load()
    return () => {
      current = false
    }
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
    setOpeningHours([])
    setIsLoadingSlots(false)
    setBookingSheetIsOpen(false)
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(undefined)
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleCreateBooking = () =>
    startCreating(async () => {
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
    })

  const timeList = useMemo(() => {
    if (!selectedDay) return []
    return getTimeList({
      intervals: unavailable,
      selectedDay,
      durationMinutes: service.durationMinutes,
      openingHours,
    })
  }, [unavailable, selectedDay, service.durationMinutes, openingHours])

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

                <SheetContent
                  className="w-[92%] gap-0 p-0 sm:max-w-md"
                  aria-describedby={undefined}
                >
                  <SheetHeader className="items-center border-b border-solid px-5 py-4">
                    <SheetTitle>Fazer Reserva</SheetTitle>
                  </SheetHeader>

                  <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
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
                      <div className="border-b border-solid p-5">
                        {isLoadingSlots ? (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {Array.from({ length: 12 }).map((_, i) => (
                              <div
                                key={i}
                                className="bg-muted/60 h-8 animate-pulse rounded-md"
                              />
                            ))}
                          </div>
                        ) : timeList.length > 0 ? (
                          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                            {timeList.map((time) => (
                              <Button
                                key={time}
                                size="sm"
                                variant={
                                  selectedTime === time ? "default" : "outline"
                                }
                                onClick={() => handleTimeSelect(time)}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-sm">
                            {isClosedOn(openingHours, selectedDay)
                              ? "A barbearia não atende nesse dia."
                              : "Os horários desse dia já foram preenchidos."}
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
                  </div>

                  <SheetFooter className="border-t border-solid px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <Button
                      className="w-full"
                      onClick={handleCreateBooking}
                      disabled={!selectedDay || !selectedTime || isCreating}
                    >
                      {isCreating ? "Confirmando..." : "Confirmar"}
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
