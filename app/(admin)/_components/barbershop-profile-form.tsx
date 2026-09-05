"use client"

import { Button } from "@/app/_components/ui/button"
import { Card, CardContent } from "@/app/_components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/app/_components/ui/form"
import { Input } from "@/app/_components/ui/input"
import { Textarea } from "@/app/_components/ui/textarea"
import { zodResolver } from "@hookform/resolvers/zod"
import { PlusIcon, SaveIcon, Trash2Icon } from "lucide-react"
import Image from "next/image"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import { saveBarbershopProfile } from "../_actions/barbershop"
import {
  barbershopProfileSchema,
  type BarbershopProfileInput,
} from "../_lib/barbershop-schema"

interface BarbershopProfileFormProps {
  profile: BarbershopProfileInput
}

const BarbershopProfileForm = ({ profile }: BarbershopProfileFormProps) => {
  const form = useForm<BarbershopProfileInput>({
    resolver: zodResolver(barbershopProfileSchema),
    defaultValues: profile,
  })

  const phones = useFieldArray({
    control: form.control,
    name: "phones" as never,
  })

  const imageUrl = form.watch("imageUrl")

  const onSubmit = async (values: BarbershopProfileInput) => {
    const result = await saveBarbershopProfile(values)

    if (result.ok) {
      toast.success("Dados da barbearia salvos.")
      form.reset(values)
    } else {
      toast.error(result.error)
    }
  }

  return (
    <Card>
      <CardContent className="p-4 lg:p-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome da barbearia</FormLabel>
                  <FormControl>
                    <Input placeholder="Barbearia do Zé" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Endereço</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Rua das Flores, 123 — Centro"
                      {...field}
                    />
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
                  <FormLabel>Sobre a barbearia</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Conte o que a barbearia tem de diferente: ambiente, especialidade, tempo de casa."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Este texto aparece para o cliente na página da barbearia.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Foto de capa</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>
                    Cole o endereço de uma imagem. O envio de arquivo direto
                    ainda não está disponível.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {imageUrl && !form.getFieldState("imageUrl").invalid && (
              <div className="relative h-40 w-full overflow-hidden rounded-lg border">
                <Image
                  src={imageUrl}
                  alt="Prévia da foto de capa"
                  fill
                  sizes="(max-width: 768px) 100vw, 640px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <FormLabel>Telefones</FormLabel>
                {phones.fields.length < 3 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => phones.append("" as never)}
                  >
                    <PlusIcon />
                    Adicionar
                  </Button>
                )}
              </div>

              {phones.fields.map((item, index) => (
                <FormField
                  key={item.id}
                  control={form.control}
                  name={`phones.${index}`}
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center gap-2">
                        <FormControl>
                          <Input placeholder="(11) 99999-9999" {...field} />
                        </FormControl>
                        {phones.fields.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Remover telefone ${index + 1}`}
                            onClick={() => phones.remove(index)}
                          >
                            <Trash2Icon className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full sm:w-auto"
            >
              <SaveIcon />
              {form.formState.isSubmitting ? "Salvando..." : "Salvar dados"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default BarbershopProfileForm
