import { cn } from "cn"
import { CaretDownIcon, CheckIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  type StyleProp,
  type View,
  type ViewStyle,
} from "react-native"
import { FadeIn, FadeOut, ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as ComboboxPrimitive from "@/components/primitives/combobox"
import { useFieldRootContext } from "@/components/primitives/field"
import { useOptionalPositionerContext } from "@/components/primitives/positioner"
import {
  resolveClassName,
  resolveStyle,
} from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

const Combobox = ComboboxPrimitive.Root

const ComboboxValue = ComboboxPrimitive.Value

const ComboboxCollection = ComboboxPrimitive.Collection

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

function wrapText(children: React.ReactNode, className: string) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text className={className}>{children}</Text>
  }
  return children
}

function ComboboxTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Trigger> & {
  children?: React.ReactNode
}) {
  return (
    <ComboboxPrimitive.Trigger
      accessibilityLabel="Show options"
      className={(state) =>
        cn(
          "size-6 items-center justify-center rounded-full active:bg-item-pressed",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {children}
      <Icon
        as={CaretDownIcon}
        className={cn(
          "size-4 text-label-secondary",
          props.disabled && "text-label-quaternary"
        )}
      />
    </ComboboxPrimitive.Trigger>
  )
}

function ComboboxClear({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Clear>) {
  return (
    <ComboboxPrimitive.Clear
      accessibilityLabel="Clear"
      className={(state) =>
        cn(
          "size-6 items-center justify-center rounded-full active:bg-item-pressed",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      <Icon
        as={XIcon}
        className={cn(
          "size-4 text-label",
          props.disabled && "text-label-quaternary"
        )}
      />
    </ComboboxPrimitive.Clear>
  )
}

function ComboboxInput({
  className,
  children,
  disabled = false,
  showTrigger = true,
  showClear = false,
  invalid,
  onFocus,
  onBlur,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Input>, "className"> & {
  className?: string
  children?: React.ReactNode
  showTrigger?: boolean
  showClear?: boolean
  invalid?: boolean
}) {
  const combobox = ComboboxPrimitive.useComboboxRootContext("ComboboxInput")
  const field = useFieldRootContext()
  const [focused, setFocused] = React.useState(false)
  const isDisabled = disabled || combobox.disabled
  const isInvalid = invalid ?? field.state.invalid
  const inPopup = useOptionalPositionerContext() !== null
  const clearVisible =
    showClear && (combobox.hasValue || combobox.inputValue !== "")
  return (
    <ComboboxPrimitive.InputGroup
      className={cn(
        "h-11 w-full min-w-0 flex-row items-center gap-1 rounded-lg border border-transparent bg-control pr-2",
        isInvalid && "border-danger bg-danger/5 dark:bg-danger/10",
        focused && !inPopup && "border-focus",
        inPopup && "m-1.5 mb-0 h-8 w-auto border-separator/30",
        isDisabled && "bg-control-disabled",
        className
      )}
    >
      <ComboboxPrimitive.Input
        disabled={disabled}
        className={cn(
          "h-full min-w-0 flex-1 py-1 pr-1.5 pl-3 text-base text-label",
          isDisabled && "text-label-quaternary"
        )}
        placeholderTextColorClassName={
          isDisabled ? "accent-label-quaternary" : "accent-label-secondary"
        }
        cursorColorClassName="accent-accent"
        selectionColorClassName="accent-accent"
        onFocus={(event) => {
          setFocused(true)
          onFocus?.(event)
        }}
        onBlur={(event) => {
          setFocused(false)
          onBlur?.(event)
        }}
        {...props}
      />
      {showTrigger && !clearVisible ? (
        <ComboboxTrigger disabled={disabled} />
      ) : null}
      {showClear ? <ComboboxClear disabled={disabled} /> : null}
      {children}
    </ComboboxPrimitive.InputGroup>
  )
}

type PositionerProps = React.ComponentProps<typeof ComboboxPrimitive.Positioner>

function ContentPopup({
  className,
  style,
  chips,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> & { chips: boolean }) {
  const positioner = useOptionalPositionerContext()
  const anchorWidth = positioner?.anchorWidth ?? 0
  const sizing = {
    width: anchorWidth || undefined,
    minWidth: chips ? anchorWidth : anchorWidth + 28,
    maxWidth: positioner?.availableWidth,
    maxHeight: positioner?.availableHeight,
  }
  return (
    <ComboboxPrimitive.Popup
      className={(state) =>
        cn(
          "relative overflow-hidden rounded-xl border border-label/5 bg-surface-raised shadow-lg dark:border-label/10",
          resolveClassName(className, state)
        )
      }
      style={(state) => [
        sizing,
        resolveStyle(style, state) as StyleProp<ViewStyle>,
      ]}
      {...props}
    />
  )
}

function ComboboxContent({
  className,
  side = "bottom",
  sideOffset = 6,
  align = "start",
  alignOffset = 0,
  anchor,
  portalHost,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Popup> &
  Pick<
    PositionerProps,
    "side" | "align" | "sideOffset" | "alignOffset" | "anchor"
  > & {
    portalHost?: string
  }) {
  return (
    <ComboboxPrimitive.Portal hostName={portalHost}>
      <FullWindowOverlay>
        <ComboboxPrimitive.Positioner
          side={side}
          sideOffset={sideOffset}
          align={align}
          alignOffset={alignOffset}
          anchor={anchor}
        >
          <AnimatedView
            entering={FadeIn.reduceMotion(ReduceMotion.System)}
            exiting={FadeOut.reduceMotion(ReduceMotion.System)}
          >
            <TextClassContext.Provider value="text-base text-label">
              <ContentPopup className={className} chips={!!anchor} {...props} />
            </TextClassContext.Provider>
          </AnimatedView>
        </ComboboxPrimitive.Positioner>
      </FullWindowOverlay>
    </ComboboxPrimitive.Portal>
  )
}

function ComboboxList({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.List>) {
  return (
    <ComboboxPrimitive.List
      className={(state) => cn("max-h-72", resolveClassName(className, state))}
      contentContainerClassName="p-1.5"
      showsVerticalScrollIndicator={false}
      {...props}
    />
  )
}

function ComboboxItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxPrimitive.Item>, "children"> & {
  children?: React.ReactNode
}) {
  return (
    <TextClassContext.Provider
      value={cn(
        "select-none text-base text-label",
        props.disabled && "text-label-quaternary"
      )}
    >
      <ComboboxPrimitive.Item
        className={(state) =>
          cn(
            "relative w-full flex-row items-center gap-2.5 rounded-md py-2 pr-8 pl-3",
            state.highlighted && "bg-item-pressed",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {wrapText(children, "flex-1")}
        <ComboboxPrimitive.ItemIndicator className="absolute right-2 size-4 items-center justify-center">
          <Icon as={CheckIcon} className="size-4 shrink-0 text-link" />
        </ComboboxPrimitive.ItemIndicator>
      </ComboboxPrimitive.Item>
    </TextClassContext.Provider>
  )
}

function ComboboxGroup({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Group>) {
  return <ComboboxPrimitive.Group className={className} {...props} />
}

function ComboboxLabel({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.GroupLabel>) {
  return (
    <ComboboxPrimitive.GroupLabel
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

function ComboboxEmpty({
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Empty>) {
  return (
    <ComboboxPrimitive.Empty
      className={(state) =>
        cn(
          "w-full items-center justify-center py-2",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {wrapText(children, "text-center text-sm text-label-secondary")}
    </ComboboxPrimitive.Empty>
  )
}

function ComboboxSeparator({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Separator>) {
  return (
    <ComboboxPrimitive.Separator
      className={(state) =>
        cn(
          "-mx-1.5 my-1.5 h-px bg-separator",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function ComboboxChips({
  className,
  invalid,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chips> & {
  invalid?: boolean
}) {
  const { hasValue, disabled } =
    ComboboxPrimitive.useComboboxRootContext("ComboboxChips")
  const field = useFieldRootContext()
  const isInvalid = invalid ?? field.state.invalid
  return (
    <ComboboxPrimitive.Chips
      className={(state) =>
        cn(
          "min-h-11 w-full flex-row flex-wrap items-center gap-1.5 rounded-lg border border-transparent bg-control px-3 py-1.5",
          hasValue && "px-1.5",
          isInvalid && "border-danger bg-danger/5 dark:bg-danger/10",
          disabled && "bg-control-disabled",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function ComboboxChip({
  className,
  children,
  showRemove = true,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Chip> & {
  showRemove?: boolean
}) {
  const combobox = ComboboxPrimitive.useComboboxRootContext("ComboboxChip")
  const disabled = !!props.disabled || combobox.disabled
  return (
    <ComboboxPrimitive.Chip
      className={(state) =>
        cn(
          "h-5.5 flex-row items-center justify-center gap-1 rounded-full bg-accent-surface px-2.5",
          showRemove && "pr-0.5",
          state.disabled && "bg-control-disabled",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {wrapText(
        children,
        cn("text-xs text-link", disabled && "text-label-quaternary")
      )}
      {showRemove ? (
        <ComboboxPrimitive.ChipRemove
          accessibilityLabel="Remove"
          render={
            <Button
              variant="ghost"
              size="icon-xs"
              className="-ml-1 opacity-50 active:opacity-100"
            />
          }
        >
          <Icon
            as={XIcon}
            className={cn(
              "size-3 text-link",
              disabled && "text-label-quaternary"
            )}
          />
        </ComboboxPrimitive.ChipRemove>
      ) : null}
    </ComboboxPrimitive.Chip>
  )
}

function ComboboxChipsInput({
  className,
  ...props
}: React.ComponentProps<typeof ComboboxPrimitive.Input>) {
  return (
    <ComboboxPrimitive.Input
      className={(state) =>
        cn(
          "h-6 min-w-16 flex-1 px-1 py-0 text-base text-label",
          state.disabled && "text-label-quaternary",
          resolveClassName(className, state)
        )
      }
      placeholderTextColorClassName="accent-label-secondary"
      cursorColorClassName="accent-accent"
      selectionColorClassName="accent-accent"
      {...props}
    />
  )
}

function useComboboxAnchor() {
  return React.useRef<View | null>(null)
}

export {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
}
