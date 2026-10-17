"use client"

import { useModifierKey } from "@/hooks/use-platform"
import { cn } from "@/lib/utils"

function Kbd({
  className,
  mod,
  children,
  ...props
}: React.ComponentProps<"kbd"> & { mod?: boolean }) {
  const modifier = useModifierKey(children != null)

  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "cn-kbd pointer-events-none items-center justify-center select-none [&_svg:not([class*='size-'])]:size-3",
        className
      )}
      {...props}
    >
      {mod && modifier}
      {children}
    </kbd>
  )
}

function KbdGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <kbd
      data-slot="kbd-group"
      className={cn("cn-kbd-group items-center", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
