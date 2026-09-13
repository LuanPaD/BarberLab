import { z } from "zod"

export const serviceSchema = z.object({
  id: z.uuid().optional(),
  name: z.string().trim().min(2, "Informe o nome do serviço.").max(60),
  description: z.string().trim().min(5, "Descreva o serviço.").max(240),
  imageUrl: z.url("Informe uma URL de imagem válida."),
  price: z
    .number({ message: "Informe o preço." })
    .positive("O preço precisa ser maior que zero.")
    .max(99999),
  durationMinutes: z
    .number({ message: "Informe a duração." })
    .int("Use minutos inteiros.")
    .min(5, "Mínimo de 5 minutos.")
    .max(480, "Máximo de 8 horas."),
  isActive: z.boolean(),
})

export type ServiceInput = z.infer<typeof serviceSchema>
