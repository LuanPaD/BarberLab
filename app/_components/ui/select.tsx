import * as React from "react"
import { ChevronDownIcon } from "lucide-react"

import { cn } from "@/app/_lib/utils"

const Select = React.forwardRef<
  HTMLSelectElement,
  React.ComponentProps<"select">
>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative">
      <select
        className={cn(
          "border-input focus-visible:ring-ring [&>option]:bg-card [&>option]:text-foreground flex h-9 w-full appearance-none rounded-md border bg-transparent px-3 py-1 pr-9 text-base shadow-xs transition-colors focus-visible:ring-1 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="text-muted-foreground pointer-events-none absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2" />
    </div>
  )
})
Select.displayName = "Select"

export { Select }
