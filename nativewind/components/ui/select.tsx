import { cn } from "cn"
import { CaretDownIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as SelectPrimitive from "@/components/primitives/select"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

interface Option {
  value: string
  label: string
}

const Select = SelectPrimitive.Root

const SelectGroup = SelectPrimitive.Group

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      numberOfLines={1}
      className={(state) =>
        cn(
          "flex flex-row items-center gap-1.5 text-sm text-foreground",
          state.placeholder && "text-muted-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function SelectTrigger({
  className,
  children,
  size = "default",
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode
  size?: "default" | "sm"
}) {
  return (
    <SelectPrimitive.Trigger
      className={(state) =>
        cn(
          "h-9 flex-row items-center justify-between gap-1.5 rounded-3xl border border-transparent bg-input-50 px-3 py-2",
          state.disabled && "opacity-50",
          size === "sm" && "h-8",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <Icon as={CaretDownIcon} className="size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

type PositionerProps = React.ComponentProps<typeof SelectPrimitive.Positioner>

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 4,
  align = "center",
  alignOffset = 0,
  portalHost,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup> &
  Pick<PositionerProps, "align" | "alignOffset" | "side" | "sideOffset"> & {
    portalHost?: string
  }) {
  return (
    <SelectPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <SelectPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
        >
          <AnimatedView
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
          >
            <TextClassContext.Provider value="text-sm text-popover-foreground">
              <SelectPrimitive.Popup
                className={(state) =>
                  cn(
                    "relative min-w-36 rounded-3xl border border-foreground-5 bg-popover shadow-lg dark:border-foreground-10",
                    resolveClassName(className, state)
                  )
                }
                {...props}
              >
                <SelectPrimitive.List className="w-full p-1.5">
                  {children}
                </SelectPrimitive.List>
              </SelectPrimitive.Popup>
            </TextClassContext.Provider>
          </AnimatedView>
        </SelectPrimitive.Positioner>
      </FullWindowOverlay>
    </SelectPrimitive.Portal>
  )
}

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.GroupLabel>) {
  return (
    <SelectPrimitive.GroupLabel
      className={(state) =>
        cn(
          "px-3 py-2.5 text-xs text-muted-foreground",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function SelectItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof SelectPrimitive.Item>, "children"> & {
  children?: React.ReactNode
}) {
  return (
    <SelectPrimitive.Item
      className={(state) =>
        cn(
          "relative w-full flex-row items-center gap-2.5 rounded-2xl py-2 pr-8 pl-3",
          state.highlighted && "bg-accent",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <SelectPrimitive.ItemIndicator className="absolute right-2 size-4 items-center justify-center">
        <Icon as={CheckIcon} className="size-4 shrink-0 text-foreground" />
      </SelectPrimitive.ItemIndicator>
      <SelectPrimitive.ItemText className="select-none text-sm font-medium text-foreground">
        {children}
      </SelectPrimitive.ItemText>
    </SelectPrimitive.Item>
  )
}

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Separator>) {
  return (
    <SelectPrimitive.Separator
      className={(state) =>
        cn("-mx-1.5 my-1.5 h-px bg-border", resolveClassName(className, state))
      }
      {...props}
    />
  )
}

export {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
}
