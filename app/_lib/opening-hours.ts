export interface OpeningHourSlot {
  weekday: number
  opensAt: string
  closesAt: string
  isClosed: boolean
}

export const WEEKDAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
] as const

const SLOT_STEP_MINUTES = 30

export const DEFAULT_OPENING_HOURS: OpeningHourSlot[] = [
  0, 1, 2, 3, 4, 5, 6,
].map((weekday) => ({
  weekday,
  opensAt: "09:00",
  closesAt: "19:00",
  isClosed: weekday === 0,
}))

export const withDefaults = (hours: OpeningHourSlot[]): OpeningHourSlot[] =>
  DEFAULT_OPENING_HOURS.map(
    (padrao) => hours.find((h) => h.weekday === padrao.weekday) ?? padrao,
  )

const toMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number)
  return hours * 60 + minutes
}

const toTime = (minutes: number) =>
  `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(
    minutes % 60,
  ).padStart(2, "0")}`

export const buildDaySlots = (
  hours: OpeningHourSlot | undefined,
  durationMinutes: number,
) => {
  if (!hours || hours.isClosed) return []

  const opens = toMinutes(hours.opensAt)
  const closes = toMinutes(hours.closesAt)
  const slots: string[] = []

  for (
    let start = opens;
    start + durationMinutes <= closes;
    start += SLOT_STEP_MINUTES
  ) {
    slots.push(toTime(start))
  }

  return slots
}

export const findDayHours = (
  hours: OpeningHourSlot[],
  date: Date,
): OpeningHourSlot | undefined =>
  hours.find((hour) => hour.weekday === date.getDay())

export const isClosedOn = (hours: OpeningHourSlot[], date: Date) => {
  const day = findDayHours(hours, date)
  return !day || day.isClosed
}
