import { Card, CardContent } from "@/app/_components/ui/card"
import type { LucideIcon } from "lucide-react"

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
}

const EmptyState = ({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) => {
  return (
    <Card className="bg-card/40 border-dashed">
      <CardContent className="flex flex-col items-center justify-center gap-3 px-6 py-12 text-center">
        <div className="bg-secondary rounded-full p-3">
          <Icon className="text-muted-foreground h-6 w-6" />
        </div>
        <div className="space-y-1">
          <p className="font-semibold">{title}</p>
          <p className="text-muted-foreground mx-auto max-w-sm text-sm">
            {description}
          </p>
        </div>
        {action}
      </CardContent>
    </Card>
  )
}

export default EmptyState
