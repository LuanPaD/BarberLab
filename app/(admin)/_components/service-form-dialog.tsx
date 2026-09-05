"use client"

import { Button } from "@/app/_components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form"
import { Input } from "@/app/_components/ui/input"
import { Select } from "@/app/_components/ui/select"
import { Switch } from "@/app/_components/ui/switch"
import { Textarea } from "@/app/_components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { upsertService } from "../_actions/services"
import type { AdminService } from "../_data/get-services"
import { serviceSchema, type ServiceInput } from "../_lib/service-schema"

const DURATION_OPTIONS = [15, 20, 30, 45, 60, 75, 90, 120]

const EMPTY: ServiceInput = {
  name: "",
  description: "",
  imageUrl: "",
  price: 0,
  durationMinutes: 45,
  isActive: true,
}

interface ServiceFormDialogProps {
  open: boolean
  // eslint-disable-next-line no-unused-vars
  onOpenChange: (open: boolean) => void
  service?: AdminService | null
}

const ServiceFormDialog = ({
  open,
  onOpenChange,
  service,
}: ServiceFormDialogProps) => {
  const form = useForm<ServiceInput>({
    resolver: zodResolver(serviceSchema),
    defaultValues: EMPTY,
  })

  useEffect(() => {
    if (!open) return
    form.reset(
      service
        ? {
            id: service.id,
            name: service.name,
            description: service.description,
            imageUrl: service.imageUrl,
            price: service.price,
            durationMinutes: service.durationMinutes,
            isActive: service.isActive,
          }
        : EMPTY,
    )
  }, [open, service, form])

  const onSubmit = async (values: ServiceInput) => {
    const result = await upsertService(values)

    if (result.ok) {
      toast.success(service ? "Serviço atualizado." : "Serviço criado.")
      onOpenChange(false)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-[92%] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {service ? "Editar serviço" : "Novo serviço"}
          </DialogTitle>
          <DialogDescription>
            Nome, preço e duração aparecem para o cliente na hora de agendar.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome</FormLabel>
                  <FormControl>
                    <Input placeholder="Corte de cabelo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Estilo personalizado com técnicas modernas."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        min="0"
                        placeholder="60,00"
                        value={field.value === 0 ? "" : field.value}
                        onChange={(event) =>
                          field.onChange(
                            event.target.value === ""
                              ? 0
                              : Number(event.target.value),
                          )
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="durationMinutes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração</FormLabel>
                    <FormControl>
                      <Select
                        value={String(field.value)}
                        onChange={(event) =>
                          field.onChange(Number(event.target.value))
                        }
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                      >
                        {DURATION_OPTIONS.map((minutes) => (
                          <option key={minutes} value={minutes}>
                            {minutes} min
                          </option>
                        ))}
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL da imagem</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://..."
                      inputMode="url"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5 pr-4">
                    <FormLabel>Disponível para agendamento</FormLabel>
                    <p className="text-muted-foreground text-xs">
                      Desativado, o serviço some do site mas o histórico
                      continua.
                    </p>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex flex-row gap-3 pt-2">
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {service ? "Salvar" : "Criar serviço"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ServiceFormDialog
