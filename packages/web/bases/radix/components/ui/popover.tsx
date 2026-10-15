"use client"

import { Popover as PopoverPrimitive } from "radix-ui"
import * as React from "react"
import { cn } from "@/lib/utils"

type PopoverLabels = {
  setTitleId?: (id: string | undefined) => void
  setDescriptionId?: (id: string | undefined) => void
}

const PopoverLabelsContext = React.createContext<PopoverLabels>({})

function useLabelId(
  id: string | undefined,
  register: ((id: string | undefined) => void) | undefined
) {
  const generatedId = React.useId()
  const labelId = id ?? generatedId

  React.useLayoutEffect(() => {
    register?.(labelId)
    return () => register?.(undefined)
  }, [labelId, register])

  return labelId
}

function Popover({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Root>) {
  return <PopoverPrimitive.Root data-slot="popover" {...props} />
}

function PopoverTrigger({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Trigger>) {
  return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />
}

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  children,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Content>) {
  const [titleId, setTitleId] = React.useState<string>()
  const [descriptionId, setDescriptionId] = React.useState<string>()
  const labels = React.useMemo(() => ({ setTitleId, setDescriptionId }), [])

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        data-slot="popover-content"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className={cn(
          "z-50 flex w-72 origin-(--radix-popover-content-transform-origin) flex-col gap-4 rounded-2xl bg-popover p-4 text-base text-popover-foreground shadow-lg ring-1 ring-foreground/5 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:ring-foreground/10 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className
        )}
        {...props}
      >
        <PopoverLabelsContext.Provider value={labels}>
          {children}
        </PopoverLabelsContext.Provider>
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}

function PopoverAnchor({
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Anchor>) {
  return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />
}

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("flex flex-col gap-1 text-sm", className)}
      {...props}
    />
  )
}

function PopoverTitle({ className, id, ...props }: React.ComponentProps<"h2">) {
  const { setTitleId } = React.useContext(PopoverLabelsContext)
  const titleId = useLabelId(id, setTitleId)

  return (
    <h2
      id={titleId}
      data-slot="popover-title"
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  id,
  ...props
}: React.ComponentProps<"p">) {
  const { setDescriptionId } = React.useContext(PopoverLabelsContext)
  const descriptionId = useLabelId(id, setDescriptionId)

  return (
    <p
      id={descriptionId}
      data-slot="popover-description"
      className={cn("text-muted-foreground", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverAnchor,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
