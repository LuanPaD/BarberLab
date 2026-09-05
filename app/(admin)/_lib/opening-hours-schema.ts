import { z } from "zod"

const time = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Horário inválido.")

export const openingHoursSchema = z
  .array(
    z.object({
      weekday: z.number().int().min(0).max(6),
      opensAt: time,
      closesAt: time,
      isClosed: z.boolean(),
    }),
  )
  .length(7, "Informe os sete dias da semana.")
  .refine((dias) => dias.every((d) => d.isClosed || d.closesAt > d.opensAt), {
    message: "O fechamento precisa ser depois da abertura.",
  })

export type OpeningHoursInput = z.infer<typeof openingHoursSchema>
