import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

const DEFAULT_COUNTRY_CODE = "55"

/**
 * Normaliza um telefone brasileiro para o formato que o wa.me espera:
 * só dígitos, com DDI. Devolve null quando o número não é aproveitável.
 *
 * Aceita as formas que aparecem no banco e que o usuário digita:
 * "(11) 98204-5108", "11982045108", "5511982045108", "+55 11 98204-5108".
 */
export const normalizePhone = (
  phone: string | null | undefined,
): string | null => {
  if (!phone) return null

  // Um "+" na frente diz que o DDI já veio junto — não prefixar o 55.
  const hasExplicitCountryCode = phone.trim().startsWith("+")

  let digits = phone.replace(/\D/g, "")
  if (!digits) return null

  if (hasExplicitCountryCode) {
    return digits.length >= 8 && digits.length <= 15 ? digits : null
  }

  // Alguns cadastros trazem o zero do DDD ("011 98204-5108").
  if (digits.startsWith("0")) {
    digits = digits.replace(/^0+/, "")
  }

  // DDD + número: 10 dígitos (fixo) ou 11 (celular com o 9).
  if (digits.length === 10 || digits.length === 11) {
    return `${DEFAULT_COUNTRY_CODE}${digits}`
  }

  // Já veio com o DDI 55.
  if (
    digits.startsWith(DEFAULT_COUNTRY_CODE) &&
    (digits.length === 12 || digits.length === 13)
  ) {
    return digits
  }

  // Outro DDI, tamanho plausível para número internacional.
  if (digits.length >= 11 && digits.length <= 15) {
    return digits
  }

  return null
}

export interface WhatsAppBookingInfo {
  serviceName: string
  date: Date
  barbershopName: string
  barbershopAddress?: string | null
  customerName?: string | null
  price?: number | null
}

const formatPrice = (price: number) =>
  Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
    price,
  )

const formatWhen = (date: Date) => ({
  day: format(date, "dd/MM/yyyy", { locale: ptBR }),
  weekday: format(date, "EEEE", { locale: ptBR }),
  time: format(date, "HH:mm", { locale: ptBR }),
})

/** Mensagem que o cliente manda para a barbearia confirmando a reserva. */
export const buildCustomerConfirmationMessage = ({
  serviceName,
  date,
  barbershopName,
  customerName,
  price,
}: WhatsAppBookingInfo) => {
  const { day, weekday, time } = formatWhen(date)

  return [
    `Olá, ${barbershopName}! Acabei de agendar pelo Barber Lab.`,
    "",
    `*Serviço:* ${serviceName}`,
    `*Data:* ${day} (${weekday})`,
    `*Horário:* ${time}`,
    price != null ? `*Valor:* ${formatPrice(price)}` : null,
    customerName ? `*Cliente:* ${customerName}` : null,
    "",
    "Podem confirmar, por favor?",
  ]
    .filter((line) => line !== null)
    .join("\n")
}

/** Mensagem que o barbeiro manda para o cliente lembrando do horário. */
export const buildBarberReminderMessage = ({
  serviceName,
  date,
  barbershopName,
  barbershopAddress,
  customerName,
}: WhatsAppBookingInfo) => {
  const { day, weekday, time } = formatWhen(date)
  const greeting = customerName ? `Olá, ${customerName}!` : "Olá!"

  return [
    `${greeting} Aqui é da ${barbershopName}, passando para lembrar do seu horário.`,
    "",
    `*Serviço:* ${serviceName}`,
    `*Data:* ${day} (${weekday})`,
    `*Horário:* ${time}`,
    barbershopAddress ? `*Endereço:* ${barbershopAddress}` : null,
    "",
    "Podemos confirmar sua presença?",
  ]
    .filter((line) => line !== null)
    .join("\n")
}

/**
 * Monta o deep link do WhatsApp. Sem API oficial — só o wa.me, para não
 * arriscar banimento do número.
 *
 * Sem telefone válido o link vai sem destinatário: o WhatsApp abre com a
 * mensagem pronta e a pessoa escolhe o contato. É o que permite o lembrete
 * funcionar mesmo para cliente que ainda não cadastrou telefone.
 */
export const buildWhatsAppUrl = ({
  phone,
  message,
}: {
  phone?: string | null
  message: string
}) => {
  const normalized = normalizePhone(phone)
  const text = encodeURIComponent(message)

  return normalized
    ? `https://wa.me/${normalized}?text=${text}`
    : `https://wa.me/?text=${text}`
}
