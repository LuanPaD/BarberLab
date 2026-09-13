import { Card, CardContent } from "@/app/_components/ui/card"
import { cn } from "@/app/_lib/utils"
import type { LucideIcon } from "lucide-react"

interface StatCardProps {
  label: string
  value: string
  hint?: string
  icon: LucideIcon
  tone?: "default" | "primary" | "warning" | "destructive"
}

const TONES = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
  warning: "bg-amber-500/10 text-amber-400",
  destructive: "bg-destructive/10 text-destructive",
} as const

const StatCard = ({
  label,
  value,
  hint,
  icon: Icon,
  tone = "default",
}: StatCardProps) => {
  return (
    <Card className="bg-card/50 hover:border-primary/30 backdrop-blur-sm transition-colors">
      <CardContent className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:gap-3 lg:gap-4 lg:p-5">
        <div
          className={cn("w-fit shrink-0 rounded-lg p-2 lg:p-2.5", TONES[tone])}
        >
          <Icon className="h-4 w-4 lg:h-5 lg:w-5" />
        </div>
        <div className="min-w-0">
          <p className="text-xl leading-tight font-bold lg:text-2xl">{value}</p>
          <p className="text-muted-foreground text-xs leading-tight lg:text-sm">
            {label}
          </p>
          {hint && (
            <p className="text-muted-foreground/70 mt-0.5 text-[11px] leading-tight">
              {hint}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default StatCard
