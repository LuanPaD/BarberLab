"use client"

import { Badge } from "@/app/_components/ui/badge"
import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/_components/ui/dialog"
import { Switch } from "@/app/_components/ui/switch"
import { cn } from "@/app/_lib/utils"
import { PencilIcon, PlusIcon, ScissorsIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { deleteService, setServiceActive } from "../_actions/services"
import type { AdminService } from "../_data/get-services"
import { formatCurrency, formatDuration } from "../_lib/format"
import EmptyState from "./empty-state"
import ServiceFormDialog from "./service-form-dialog"

interface ServicesManagerProps {
  services: AdminService[]
}

const ServicesManager = ({ services }: ServicesManagerProps) => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editing, setEditing] = useState<AdminService | null>(null)
  const [pendingDeletion, setPendingDeletion] = useState<AdminService | null>(
    null,
  )
  const [isPending, startTransition] = useTransition()

  const openCreate = () => {
    setEditing(null)
    setIsFormOpen(true)
  }

  const openEdit = (service: AdminService) => {
    setEditing(service)
    setIsFormOpen(true)
  }

  const handleToggle = (service: AdminService, isActive: boolean) => {
    startTransition(async () => {
      const result = await setServiceActive(service.id, isActive)
      if (result.ok) {
        toast.success(isActive ? "Serviço ativado." : "Serviço desativado.")
      } else {
        toast.error(result.error)
      }
    })
  }

  const handleDelete = () => {
    if (!pendingDeletion) return
    const target = pendingDeletion

    startTransition(async () => {
      const result = await deleteService(target.id)
      if (result.ok) {
        toast.success("Serviço excluído.")
        setPendingDeletion(null)
      } else {
        toast.error(result.error)
      }
    })
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-muted-foreground text-[11px] font-bold tracking-wider uppercase">
          {services.length} {services.length === 1 ? "serviço" : "serviços"}
        </h2>
        <Button size="sm" className="lg:hidden" onClick={openCreate}>
          <PlusIcon />
          Novo
        </Button>
        <Button className="hidden lg:inline-flex" onClick={openCreate}>
          <PlusIcon />
          Novo serviço
        </Button>
      </div>

      {services.length === 0 ? (
        <EmptyState
          icon={ScissorsIcon}
          title="Nenhum serviço cadastrado"
          description="Cadastre os serviços com preço e duração para que os clientes possam agendar."
          action={
            <Button onClick={openCreate}>
              <PlusIcon />
              Criar o primeiro serviço
            </Button>
          }
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.id}
              className={cn(
                "overflow-hidden transition-opacity",
                !service.isActive && "opacity-60",
                isPending && "pointer-events-none",
              )}
            >
              <CardContent className="flex gap-3 p-3">
                <div className="relative h-[110px] w-[100px] shrink-0 overflow-hidden rounded-lg">
                  <Image
                    src={service.imageUrl}
                    alt={service.name}
                    fill
                    sizes="100px"
                    className="object-cover"
                  />
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="truncate font-semibold">{service.name}</h3>
                      <Switch
                        checked={service.isActive}
                        onCheckedChange={(checked) =>
                          handleToggle(service, checked)
                        }
                        aria-label={
                          service.isActive
                            ? "Desativar serviço"
                            : "Ativar serviço"
                        }
                      />
                    </div>
                    <p className="text-muted-foreground line-clamp-2 text-xs">
                      {service.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="text-primary text-sm font-bold">
                        {formatCurrency(service.price)}
                      </span>
                      <Badge variant="secondary" className="font-normal">
                        {formatDuration(service.durationMinutes)}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-2">
                    <span className="text-muted-foreground text-[11px]">
                      {service.bookingsCount === 0
                        ? "Sem agendamentos"
                        : `${service.bookingsCount} agend.`}
                    </span>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label={`Editar ${service.name}`}
                        onClick={() => openEdit(service)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        aria-label={`Excluir ${service.name}`}
                        onClick={() => setPendingDeletion(service)}
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <ServiceFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        service={editing}
      />

      <Dialog
        open={pendingDeletion !== null}
        onOpenChange={(open) => !open && setPendingDeletion(null)}
      >
        <DialogContent className="w-[90%] max-w-md">
          <DialogHeader>
            <DialogTitle>Excluir {pendingDeletion?.name}?</DialogTitle>
            <DialogDescription>
              {pendingDeletion && pendingDeletion.bookingsCount > 0
                ? "Esse serviço já tem agendamentos, então não pode ser excluído. Desative-o para tirá-lo do site sem perder o histórico."
                : "Essa ação é irreversível."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex flex-row gap-3">
            <DialogClose asChild>
              <Button variant="secondary" className="w-full">
                Voltar
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              className="w-full"
              disabled={isPending || (pendingDeletion?.bookingsCount ?? 0) > 0}
              onClick={handleDelete}
            >
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default ServicesManager
