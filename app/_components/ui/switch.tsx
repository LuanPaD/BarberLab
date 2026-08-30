"use client"

import * as React from "react"

import { cn } from "@/app/_lib/utils"

interface SwitchProps extends Omit<
  React.ComponentProps<"button">,
  "onChange" | "value"
> {
  checked: boolean
  // eslint-disable-next-line no-unused-vars
  onCheckedChange: (checked: boolean) => void
}

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(
  ({ className, checked, onCheckedChange, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "focus-visible:ring-ring inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden disabled:cursor-not-allowed disabled:opacity-50",
          checked ? "bg-primary" : "bg-secondary",
          className,
        )}
        {...props}
      >
        <span
          className={cn(
            "bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform",
            checked ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    )
  },
)
Switch.displayName = "Switch"

export { Switch }
