"use client"

import { updateOwnPhone } from "@/app/_actions/update-profile"
import { Button } from "@/app/_components/ui/button"
import { Input } from "@/app/_components/ui/input"
import { SaveIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

const PhoneForm = ({ phone }: { phone: string }) => {
  const [value, setValue] = useState(phone)
  const [isSaving, startSaving] = useTransition()

  const salvar = () =>
    startSaving(async () => {
      const result = await updateOwnPhone({ phone: value })
      if (result.ok) {
        toast.success("Telefone salvo.")
      } else {
        toast.error(result.error)
      }
    })

  return (
    <div className="space-y-3">
      <label htmlFor="telefone" className="text-sm font-medium">
        Telefone com WhatsApp
      </label>
      <Input
        id="telefone"
        type="tel"
        inputMode="tel"
        placeholder="(11) 99999-9999"
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="text-muted-foreground text-xs">
        A barbearia usa este número para confirmar ou avisar sobre mudanças no
        seu horário. Deixe em branco para não informar.
      </p>

      <Button onClick={salvar} disabled={isSaving}>
        <SaveIcon />
        {isSaving ? "Salvando..." : "Salvar telefone"}
      </Button>
    </div>
  )
}

export default PhoneForm
