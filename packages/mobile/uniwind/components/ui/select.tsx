import { cn } from "cn"
import { CaretUpDownIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Platform, type StyleProp, type ViewStyle } from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import { useFieldRootContext } from "@/components/primitives/field"
import { useOptionalPositionerContext } from "@/components/primitives/positioner"
import * as SelectPrimitive from "@/components/primitives/select"
import {
  resolveClassName,
  resolveStyle,
} from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

interface Option {
  value: string
  label: string
}

const Select = SelectPrimitive.Root

function SelectGroup({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Group>) {
  return (
    <SelectPrimitive.Group
      className={(state) => cn("p-1.5", resolveClassName(className, state))}
      {...props}
    />
  )
}

function SelectValue({
  className,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Value>) {
  return (
    <SelectPrimitive.Value
      numberOfLines={1}
      className={(state) =>
        cn(
          "flex-1 text-left text-base text-foreground",
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
  invalid,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Trigger> & {
  children?: React.ReactNode
  size?: "default" | "sm"
  invalid?: boolean
}) {
  const field = useFieldRootContext()
  const isInvalid = invalid ?? field.state.invalid
  return (
    <SelectPrimitive.Trigger
      className={(state) =>
        cn(
          "h-11 flex-row items-center justify-between gap-1.5 self-start rounded-lg border border-transparent bg-secondary px-3 py-2",
          size === "sm" && "h-9 rounded-md",
          isInvalid &&
            "border-destructive bg-destructive/5 dark:bg-destructive/10",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children}
      <SelectPrimitive.Icon>
        <Icon as={CaretUpDownIcon} className="size-4 text-muted-foreground" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

type PositionerProps = React.ComponentProps<typeof SelectPrimitive.Positioner>

function ContentPopup({
  className,
  style,
  children,
  ...props
}: React.ComponentProps<typeof SelectPrimitive.Popup>) {
  const positioner = useOptionalPositionerContext()
  const width = positioner?.anchorWidth || undefined
  return (
    <SelectPrimitive.Popup
      className={(state) =>
        cn(
          "relative min-w-36 overflow-hidden rounded-xl border border-foreground/5 bg-popover shadow-lg dark:border-foreground/10",
          resolveClassName(className, state)
        )
      }
      style={(state) => [
        { width },
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    >
      <SelectPrimitive.List className="relative w-full">
        {children}
      </SelectPrimitive.List>
    </SelectPrimitive.Popup>
  )
}

function SelectContent({
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
            <TextClassContext.Provider value="text-base text-foreground">
              <ContentPopup {...props} />
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
          "px-3 py-2.5 text-xs font-semibold text-muted-foreground",
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
          "relative w-full flex-row items-center gap-2.5 rounded-md py-2 pr-8 pl-3",
          state.highlighted && "opacity-80",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <SelectPrimitive.ItemText className="flex-1 select-none text-base text-foreground">
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 size-4 items-center justify-center">
        <Icon as={CheckIcon} className="size-4 shrink-0 text-primary" />
      </SelectPrimitive.ItemIndicator>
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
        cn("my-1.5 h-px bg-border", resolveClassName(className, state))
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
