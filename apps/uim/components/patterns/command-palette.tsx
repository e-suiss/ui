"use client"

import { cn } from "cn"
import * as React from "react"

import { Command } from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"
import { isMacPlatform } from "@/hooks/use-platform"

type CommandPaletteContextProps = {
  isMobile: boolean
}

const CommandPaletteContext =
  React.createContext<CommandPaletteContextProps | null>(null)

function useCommandPalette() {
  const context = React.useContext(CommandPaletteContext)

  if (!context) {
    throw new Error(
      "useCommandPalette must be used within a <CommandPalette />"
    )
  }

  return context
}

function CommandPalette({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  hotkey = "k",
  floating,
  children,
}: Pick<
  React.ComponentProps<typeof Dialog>,
  "open" | "defaultOpen" | "children"
> & {
  onOpenChange?: (open: boolean) => void
  hotkey?: string | false
  floating?: boolean
}) {
  const isMobile = useIsMobile()
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen)
  const open = openProp ?? uncontrolledOpen
  const openRef = React.useRef(open)
  openRef.current = open

  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setUncontrolledOpen(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange]
  )

  React.useEffect(() => {
    if (!hotkey) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === hotkey.toLowerCase() &&
        (isMacPlatform() ? event.metaKey : event.ctrlKey)
      ) {
        event.preventDefault()
        setOpen(!openRef.current)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [hotkey, setOpen])

  const rootProps = {
    open,
    onOpenChange: (next: boolean) => setOpen(next),
    children,
  }

  return (
    <CommandPaletteContext.Provider value={{ isMobile }}>
      {isMobile ? (
        <Drawer
          data-slot="command-palette"
          floating={floating}
          showSwipeHandle
          {...rootProps}
        />
      ) : (
        <Dialog data-slot="command-palette" {...rootProps} />
      )}
    </CommandPaletteContext.Provider>
  )
}

function CommandPaletteTrigger(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & {
    render?: React.ReactElement
  }
) {
  const { isMobile } = useCommandPalette()
  const Trigger = isMobile ? DrawerTrigger : DialogTrigger

  return <Trigger data-slot="command-palette-trigger" {...props} />
}

function CommandPaletteContent({
  title = "Command Palette",
  description = "Search for a command to run...",
  showCloseButton = false,
  closeLabel,
  className,
  children,
  ...props
}: React.ComponentProps<typeof Command> & {
  title?: string
  description?: string
  showCloseButton?: boolean
  closeLabel?: string
}) {
  const { isMobile } = useCommandPalette()

  if (isMobile) {
    return (
      <DrawerContent
        data-slot="command-palette-content"
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
      >
        <DrawerHeader className="sr-only">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <Command
          className={cn(
            "rounded-none bg-transparent px-3 pt-1.25 pb-[max(--spacing(3),env(safe-area-inset-bottom))] **:data-[slot=command-list]:max-h-[60dvh]",
            showCloseButton && "**:data-[slot=command-input-wrapper]:pe-11",
            showCloseButton &&
              closeLabel &&
              "**:data-[slot=command-input-wrapper]:pe-21",
            className
          )}
          {...props}
        >
          {children}
        </Command>
      </DrawerContent>
    )
  }

  return (
    <DialogContent
      data-slot="command-palette-content"
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
      className="top-1/3 translate-y-0 overflow-hidden rounded-2xl! p-0"
    >
      <DialogHeader className="sr-only">
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>{description}</DialogDescription>
      </DialogHeader>
      <Command className={className} {...props}>
        {children}
      </Command>
    </DialogContent>
  )
}

export { CommandPalette, CommandPaletteContent, CommandPaletteTrigger }
