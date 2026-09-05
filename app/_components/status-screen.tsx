import { Button } from "./ui/button"
import Link from "next/link"

interface StatusScreenProps {
  icon: React.ReactNode
  eyebrow: string
  title: string
  description: string
  children?: React.ReactNode
}

const StatusScreen = ({
  icon,
  eyebrow,
  title,
  description,
  children,
}: StatusScreenProps) => (
  <div className="from-background via-background to-muted/20 flex min-h-svh flex-col items-center justify-center bg-linear-to-br px-5 py-16 text-center">
    <div className="bg-primary/10 text-primary mb-6 flex h-16 w-16 items-center justify-center rounded-full">
      {icon}
    </div>

    <p className="text-primary text-[11px] font-medium tracking-wider uppercase">
      {eyebrow}
    </p>
    <h1 className="mt-2 text-2xl font-bold lg:text-3xl">{title}</h1>
    <p className="text-muted-foreground mt-3 max-w-md text-sm leading-relaxed lg:text-base">
      {description}
    </p>

    <div className="mt-8 flex flex-col gap-3 sm:flex-row">{children}</div>
  </div>
)

export const HomeButton = ({ children = "Voltar para o início" }) => (
  <Button variant="outline" asChild>
    <Link href="/">{children}</Link>
  </Button>
)

export default StatusScreen
