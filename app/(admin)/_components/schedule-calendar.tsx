"use client"

import { Calendar } from "@/app/_components/ui/calendar"
import { ptBR } from "date-fns/locale"
import { usePathname, useRouter } from "next/navigation"
import { useTransition } from "react"
import { toDateParam } from "../_lib/format"

interface ScheduleCalendarProps {
  date: Date
}

const ScheduleCalendar = ({ date }: ScheduleCalendarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()

  return (
    <Calendar
      mode="single"
      locale={ptBR}
      selected={date}
      month={date}
      onMonthChange={(month) =>
        startTransition(() =>
          router.push(`${pathname}?date=${toDateParam(month)}`),
        )
      }
      onSelect={(selected) => {
        if (!selected) return
        startTransition(() =>
          router.push(`${pathname}?date=${toDateParam(selected)}`),
        )
      }}
      className={isPending ? "w-full opacity-60" : "w-full"}
    />
  )
}

export default ScheduleCalendar
