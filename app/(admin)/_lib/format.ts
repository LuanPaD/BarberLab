import { BookingStatus } from "@prisma/client"

export const formatCurrency = (value: number) =>
  Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)

export const formatDuration = (minutes: number) => {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest === 0 ? `${hours}h` : `${hours}h ${rest}min`
}

export const toDateParam = (date: Date) => {
  const offset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - offset).toISOString().slice(0, 10)
}

export const parseDateParam = (value?: string | null) => {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return new Date()
  const [year, month, day] = value.split("-").map(Number)
  const parsed = new Date(year, month - 1, day)
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed
}

interface StatusMeta {
  label: string
  variant: "default" | "secondary" | "destructive" | "outline"
  className: string
}

export const BOOKING_STATUS_META: Record<BookingStatus, StatusMeta> = {
  CONFIRMED: {
    label: "Confirmado",
    variant: "default",
    className: "bg-primary/15 text-primary border-primary/30",
  },
  COMPLETED: {
    label: "Concluído",
    variant: "secondary",
    className: "bg-secondary text-secondary-foreground border-transparent",
  },
  CANCELED: {
    label: "Cancelado",
    variant: "outline",
    className: "bg-destructive/10 text-destructive border-destructive/30",
  },
  NO_SHOW: {
    label: "Não compareceu",
    variant: "outline",
    className: "bg-amber-500/10 text-amber-400 border-amber-500/30",
  },
}
