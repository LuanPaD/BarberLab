"use client"

import { MessageCircleIcon } from "lucide-react"
import { Button, type ButtonProps } from "./ui/button"
import { buildWhatsAppUrl, normalizePhone } from "../_lib/whatsapp"
import { cn } from "../_lib/utils"

interface WhatsAppButtonProps extends Omit<ButtonProps, "asChild" | "onClick"> {
  phone?: string | null
  message: string
  label?: string
  fallbackLabel?: string
}

const WhatsAppButton = ({
  phone,
  message,
  label = "Confirmar no WhatsApp",
  fallbackLabel = "Enviar pelo WhatsApp",
  className,
  variant = "default",
  ...props
}: WhatsAppButtonProps) => {
  const hasPhone = normalizePhone(phone) !== null
  const href = buildWhatsAppUrl({ phone, message })

  return (
    <Button
      variant={variant}
      className={cn(className)}
      asChild
      title={
        hasPhone
          ? undefined
          : "Sem telefone cadastrado — o WhatsApp abre para você escolher o contato."
      }
      {...props}
    >
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircleIcon />
        {hasPhone ? label : fallbackLabel}
      </a>
    </Button>
  )
}

export default WhatsAppButton
