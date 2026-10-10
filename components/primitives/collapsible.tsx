import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { useControllableState } from "./hooks"
import { Slot } from "./slot"
import type {
  ForceMountable,
  PressableRef,
  SlottablePressableProps,
  SlottableViewProps,
  ViewRef,
} from "./types"

type RootProps = SlottableViewProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  disabled?: boolean
}

type TriggerProps = SlottablePressableProps & {
  disabled?: boolean
}

type ContentProps = ForceMountable & SlottableViewProps

type RootRef = ViewRef
type TriggerRef = PressableRef
type ContentRef = ViewRef

interface RootContextValue {
  open: boolean
  disabled: boolean
  onOpenChange: (open: boolean) => void
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Collapsible compound components cannot be rendered outside the Collapsible component"
    )
  }
  return context
}

function Root({
  asChild,
  open: openProp,
  defaultOpen,
  onOpenChange,
  disabled = false,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const [open = false, setOpen] = useControllableState<boolean>({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  })

  const context = React.useMemo<RootContextValue>(
    () => ({ open, disabled, onOpenChange: setOpen }),
    [open, disabled, setOpen]
  )

  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={context}>
      <Component ref={ref} {...props} />
    </RootContext.Provider>
  )
}

Root.displayName = "CollapsibleRoot"

function Trigger({
  asChild,
  disabled: disabledProp = false,
  onPress: onPressProp,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const { open, disabled: rootDisabled, onOpenChange } = useRootContext()
  const disabled = rootDisabled || disabledProp

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    onOpenChange(!open)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={ref}
      role="button"
      aria-expanded={open}
      aria-disabled={disabled}
      accessibilityState={{ expanded: open, disabled }}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Trigger.displayName = "CollapsibleTrigger"

function Content({
  asChild,
  forceMount,
  ref,
  ...props
}: ContentProps & React.RefAttributes<ContentRef>) {
  const { open } = useRootContext()
  if (!forceMount && !open) return null
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="region"
      aria-hidden={!open}
      importantForAccessibility={open ? "auto" : "no-hide-descendants"}
      {...props}
    />
  )
}

Content.displayName = "CollapsibleContent"

export type {
  ContentProps,
  ContentRef,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
}
export { Content, Root, Trigger, useRootContext }
