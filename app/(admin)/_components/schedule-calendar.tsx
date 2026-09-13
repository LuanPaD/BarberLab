"use client"

import { Calendar } from "@/app/_components/ui/calendar"
import { ptBR } from "date-fns/locale"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toDateParam } from "../_lib/format"

interface ScheduleCalendarProps {
  date: Date
}

const ScheduleCalendar = ({ date }: ScheduleCalendarProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const [visibleMonth, setVisibleMonth] = useState(date)

  useEffect(() => setVisibleMonth(date), [date])

  return (
    <Calendar
      mode="single"
      locale={ptBR}
      selected={date}
      month={visibleMonth}
      onMonthChange={setVisibleMonth}
      onSelect={(selectedDay) => {
        if (!selectedDay) return
        router.push(`${pathname}?date=${toDateParam(selectedDay)}`)
      }}
      className="w-full"
    />
  )
}

export default ScheduleCalendar
