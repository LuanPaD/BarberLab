import { z } from "zod"

const phone = z
  .string()
  .trim()
  .regex(
    /^\+?[\d\s().-]{8,20}$/,
    "Telefone inválido. Use algo como (11) 99999-9999.",
  )

export const barbershopProfileSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da barbearia.").max(80),
  address: z.string().trim().min(5, "Informe o endereço completo.").max(160),
  description: z
    .string()
    .trim()
    .min(20, "Escreva ao menos uma frase sobre a barbearia.")
    .max(600),
  imageUrl: z.url("Informe uma URL de imagem válida."),
  phones: z
    .array(phone)
    .min(1, "Informe ao menos um telefone.")
    .max(3, "No máximo três telefones."),
})

export type BarbershopProfileInput = z.infer<typeof barbershopProfileSchema>

export const customerProfileSchema = z.object({
  phone: phone.or(z.literal("")),
})

export type CustomerProfileInput = z.infer<typeof customerProfileSchema>
