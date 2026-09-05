"use client"

import { driver, type DriveStep } from "driver.js"
import "driver.js/dist/driver.css"
import { useEffect } from "react"
import { completeOnboarding } from "../_actions/onboarding"

interface Passo {
  marca: string
  titulo: string
  texto: string
}

const PASSOS: Passo[] = [
  {
    marca: "tour-dashboard",
    titulo: "Seu dia começa aqui",
    texto:
      "O painel mostra os atendimentos de hoje, o faturamento e quem já foi atendido. É a primeira tela que você abre pela manhã.",
  },
  {
    marca: "tour-schedule",
    titulo: "A agenda completa",
    texto:
      "Aqui você navega por qualquer dia, vê a linha do tempo e bloqueia horários — almoço, médico, folga.",
  },
  {
    marca: "tour-services",
    titulo: "Seus serviços e preços",
    texto:
      "Cadastre o que você faz, com preço e duração. O que estiver ativo aqui é o que o cliente vê na hora de agendar.",
  },
  {
    marca: "tour-settings",
    titulo: "Comece por aqui",
    texto:
      "Nas configurações ficam o nome, o endereço e a foto da barbearia, além do horário de funcionamento. Ajuste isso primeiro: é o que define os horários oferecidos ao cliente.",
  },
]

const elementoVisivel = (marca: string) =>
  Array.from(
    document.querySelectorAll<HTMLElement>(`[data-tour="${marca}"]`),
  ).find((el) => el.offsetParent !== null)

const OnboardingTour = () => {
  useEffect(() => {
    const steps: DriveStep[] = []

    for (const passo of PASSOS) {
      const element = elementoVisivel(passo.marca)
      if (!element) continue

      steps.push({
        element,
        popover: { title: passo.titulo, description: passo.texto },
      })
    }

    if (steps.length === 0) return

    const encerrar = () => {
      void completeOnboarding()
    }

    const guia = driver({
      showProgress: true,
      allowClose: true,
      nextBtnText: "Próximo",
      prevBtnText: "Voltar",
      doneBtnText: "Entendi",
      progressText: "{{current}} de {{total}}",
      steps,
      onDestroyed: encerrar,
    })

    guia.drive()

    return () => guia.destroy()
  }, [])

  return null
}

export default OnboardingTour
