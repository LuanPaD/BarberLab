"use client"

import { SearchIcon } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

export const searchInputRef = { current: null as null | HTMLInputElement }

const Search = () => {
  const [title, setTitle] = useState("")
  const [erro, setErro] = useState("")
  const router = useRouter()

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    const termo = title.trim()
    if (!termo) {
      setErro("Digite algo para buscar")
      return
    }

    router.push(`/barbershops?title=${encodeURIComponent(termo)}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 lg:gap-3">
      <div className="w-full space-y-2">
        <Input
          ref={searchInputRef}
          value={title}
          onChange={(event) => {
            setTitle(event.target.value)
            setErro("")
          }}
          placeholder="Buscar barbearia pelo nome..."
          aria-invalid={!!erro}
          className="bg-background/50 border-0 shadow-sm backdrop-blur-sm transition-shadow focus:shadow-md lg:h-14 lg:rounded-xl lg:px-6 lg:text-base"
        />
        {erro && <p className="text-destructive text-sm font-medium">{erro}</p>}
      </div>

      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 shadow-sm transition-all hover:scale-105 hover:shadow-md lg:h-14 lg:rounded-xl lg:px-8"
      >
        <SearchIcon className="lg:h-5 lg:w-5" />
        <span className="ml-2 hidden lg:inline">Buscar</span>
      </Button>
    </form>
  )
}

export default Search
