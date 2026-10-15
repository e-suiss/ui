import * as React from "react"
import { type GestureResponderEvent, Pressable, View } from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type ChangeEventReason = typeof REASONS.triggerPress | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

interface RootState {
  open: boolean
  disabled: boolean
}

type TriggerState = RootState

type PanelState = RootState

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
}

type TriggerProps = Omit<
  BaseUIComponentProps<typeof Pressable, TriggerState>,
  "children"
> & {
  children?: React.ReactNode
}

type PanelProps = BaseUIComponentProps<typeof View, PanelState> & {
  keepMounted?: boolean | undefined
}

interface RootContextValue {
  open: boolean
  disabled: boolean
  state: RootState
  setOpen: (open: boolean, eventDetails: ChangeEventDetails) => boolean
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Collapsible parts must be rendered inside Collapsible.Root"
    )
  }
  return context
}

function Root({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const [open, setOpen] = useControllableState<boolean, ChangeEventDetails>({
    value: openProp,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  })

  const state = React.useMemo<RootState>(
    () => ({ open, disabled }),
    [open, disabled]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({ open, disabled, state, setOpen }),
    [open, disabled, state, setOpen]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: elementProps,
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "CollapsibleRoot"

function Trigger({
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps) {
  const { open, disabled, state, setOpen } = useRootContext()
  const triggerRef = React.useRef<React.ComponentRef<typeof View>>(null)

  const onPress = (event: GestureResponderEvent) => {
    if (disabled) return
    setOpen(
      !open,
      createChangeEventDetails(REASONS.triggerPress, event, triggerRef.current)
    )
  }

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: [ref, triggerRef],
    props: [
      {
        accessibilityRole: "button",
        accessibilityState: { expanded: open, disabled },
        disabled,
        onPress,
      },
      elementProps,
    ],
  })
}

Trigger.displayName = "CollapsibleTrigger"

const HIDDEN_STYLE = { display: "none" } as const

function Panel({
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PanelProps) {
  const { open, state } = useRootContext()

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: open || keepMounted,
    props: [
      open
        ? null
        : {
            style: HIDDEN_STYLE,
            accessibilityElementsHidden: true,
            importantForAccessibility: "no-hide-descendants",
          },
      elementProps,
    ],
  })
}

Panel.displayName = "CollapsiblePanel"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  PanelProps,
  PanelState,
  RootContextValue,
  RootProps,
  RootState,
  TriggerProps,
  TriggerState,
}
export { Panel, Root, Trigger, useRootContext }
