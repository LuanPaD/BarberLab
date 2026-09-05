import { SearchXIcon } from "lucide-react"
import type { Metadata } from "next"
import { Button } from "./_components/ui/button"
import StatusScreen, { HomeButton } from "./_components/status-screen"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Página não encontrada | Barber Lab",
  robots: { index: false, follow: false },
}

const NotFound = () => (
  <StatusScreen
    icon={<SearchXIcon className="h-7 w-7" />}
    eyebrow="Erro 404"
    title="Página não encontrada"
    description="O endereço que você abriu não existe ou saiu do ar. Talvez o link esteja desatualizado."
  >
    <Button asChild>
      <Link href="/barbershops">Ver barbearias</Link>
    </Button>
    <HomeButton />
  </StatusScreen>
)

export default NotFound
