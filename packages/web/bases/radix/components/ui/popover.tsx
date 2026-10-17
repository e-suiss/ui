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
          "cn-popover-content z-50 w-72 origin-(--radix-popover-content-transform-origin) outline-hidden",
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

function PopoverHeader({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="popover-header"
      className={cn("cn-popover-header", className)}
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
      className={cn("cn-popover-title", className)}
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
      className={cn("cn-popover-description", className)}
      {...props}
    />
  )
}

export {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
}
