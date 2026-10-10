import { cn } from "cn"
import * as React from "react"
import { Platform, View, type ViewProps } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PopoverPrimitive from "@/components/primitives/popover"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { TextClassContext } from "@/components/ui/text"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function PopoverContent({
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  portalHost,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> &
  Pick<
    React.ComponentProps<typeof PopoverPrimitive.Positioner>,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & {
    portalHost?: string
  }) {
  return (
    <PopoverPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <PopoverPrimitive.Positioner
          align={align}
          alignOffset={alignOffset}
          side={side}
          sideOffset={sideOffset}
          className="z-50"
        >
          <TextClassContext.Provider value="text-sm text-popover-foreground">
            <PopoverPrimitive.Popup
              render={
                <AnimatedView
                  entering={FadeIn.duration(200).reduceMotion(
                    ReduceMotion.System
                  )}
                  exiting={FadeOut.reduceMotion(ReduceMotion.System)}
                />
              }
              className={(state) =>
                cn(
                  "z-50 w-72 flex-col gap-4 rounded-3xl border border-foreground/5 bg-popover p-4 shadow-lg dark:border-foreground/10",
                  resolveClassName(className, state)
                )
              }
              {...props}
            />
          </TextClassContext.Provider>
        </PopoverPrimitive.Positioner>
      </FullWindowOverlay>
    </PopoverPrimitive.Portal>
  )
}

function PopoverHeader({ className, ...props }: ViewProps) {
  return <View className={cn("flex flex-col gap-1", className)} {...props} />
}

function PopoverTitle({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Title>) {
  return (
    <PopoverPrimitive.Title
      className={(state) =>
        cn(
          "text-base font-medium text-popover-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function PopoverDescription({
  className,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Description>) {
  return (
    <PopoverPrimitive.Description
      className={(state) =>
        cn("text-sm text-muted-foreground", resolveClassName(className, state))
      }
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
