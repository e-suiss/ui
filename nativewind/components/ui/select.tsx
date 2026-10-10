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

const SelectTriggerContext = React.createContext({ disabled: false })

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
  const { disabled } = React.useContext(SelectTriggerContext)
  return (
    <SelectPrimitive.Value
      numberOfLines={1}
      className={(state) =>
        cn(
          "flex-1 text-left text-base text-label",
          state.placeholder && "text-label-secondary",
          disabled && "text-label-quaternary",
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
  const select = SelectPrimitive.useSelectRootContext("SelectTrigger")
  const isInvalid = invalid ?? field.state.invalid
  const disabled = !!props.disabled || select.floating.disabled
  const context = React.useMemo(() => ({ disabled }), [disabled])
  return (
    <SelectPrimitive.Trigger
      className={(state) =>
        cn(
          "h-11 flex-row items-center justify-between gap-1.5 self-start rounded-lg border border-transparent bg-control px-3 py-2",
          size === "sm" && "h-9 rounded-md",
          isInvalid && "border-danger bg-danger-5 dark:bg-danger-10",
          state.disabled && "bg-control-disabled",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <SelectTriggerContext.Provider value={context}>
        {children}
      </SelectTriggerContext.Provider>
      <SelectPrimitive.Icon>
        <Icon as={CaretUpDownIcon} className="size-4 text-label-secondary" />
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
          "relative min-w-36 overflow-hidden rounded-xl border border-label-5 bg-surface-raised shadow-lg dark:border-label-10",
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
            <TextClassContext.Provider value="text-base text-label">
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
          "px-3 py-2.5 text-xs font-semibold text-label-secondary",
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
          state.highlighted && "bg-item-pressed",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <SelectPrimitive.ItemText
        className={(state) =>
          cn(
            "flex-1 select-none text-base text-label",
            state.disabled && "text-label-quaternary"
          )
        }
      >
        {children}
      </SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="absolute right-2 size-4 items-center justify-center">
        <Icon as={CheckIcon} className="size-4 shrink-0 text-link" />
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
        cn("my-1.5 h-px bg-separator", resolveClassName(className, state))
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
