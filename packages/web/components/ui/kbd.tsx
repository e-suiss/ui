"use client"

import { cn } from "cn"

import { useModifierKey } from "@/hooks/use-platform"

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
        "pointer-events-none inline-flex h-5.5 max-md:hidden w-fit min-w-5.5 items-center justify-center gap-1 rounded-sm bg-muted px-1.5 font-sans text-xs text-muted-foreground select-none in-data-[slot=input-group]:bg-background in-data-[slot=tooltip-content]:bg-background/20 in-data-[slot=tooltip-content]:text-background dark:in-data-[slot=tooltip-content]:bg-background/10 [&_svg:not([class*='size-'])]:size-3",
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
      className={cn("inline-flex items-center gap-1 max-md:hidden", className)}
      {...props}
    />
  )
}

export { Kbd, KbdGroup }
