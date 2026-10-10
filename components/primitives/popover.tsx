import * as React from "react"
import {
  type GestureResponderEvent,
  type HostInstance,
  type LayoutChangeEvent,
  Pressable,
  Text,
  View,
} from "react-native"
import { REASONS } from "./event-details"
import {
  FloatingPortal,
  type FloatingRootActions,
  type FloatingRootValue,
  type FocusTarget,
  useFloatingPopup,
  useFloatingRoot,
  useFloatingTrigger,
} from "./floating-root"
import {
  Positioner as BasePositioner,
  type PositionerProps as BasePositionerProps,
  type PositionerState,
  usePositionerContext,
} from "./positioner"
import type {
  Align,
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  PortalParameters,
  Side,
} from "./types"
import { useRender } from "./use-render"

type OpenChangeReason =
  | typeof REASONS.triggerPress
  | typeof REASONS.outsidePress
  | typeof REASONS.closePress
  | typeof REASONS.backPress
  | typeof REASONS.accessibilityEscape
  | typeof REASONS.imperativeAction
  | typeof REASONS.none

type ChangeEventDetails = BaseUIChangeEventDetails<OpenChangeReason>

type RootActions = FloatingRootActions

interface RootProps {
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, eventDetails: ChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<RootActions | null> | undefined
  modal?: boolean | undefined
  children?: React.ReactNode
}

interface PopoverRootContextValue {
  root: FloatingRootValue
  titleId: string
  descriptionId: string
  titleRef: React.RefObject<HostInstance | null>
  hasTitle: boolean
  registerTitle: () => () => void
}

const PopoverRootContext = React.createContext<PopoverRootContextValue | null>(
  null
)

function usePopoverRootContext(componentName = "Popover part") {
  const context = React.useContext(PopoverRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Popover.Root`)
  }
  return context
}

function Root({
  children,
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  actionsRef,
  modal = false,
}: RootProps) {
  const root = useFloatingRoot<OpenChangeReason>({
    open,
    defaultOpen,
    onOpenChange,
    onOpenChangeComplete,
    actionsRef,
    modal,
  })
  const titleRef = React.useRef<HostInstance>(null)
  const [titleCount, setTitleCount] = React.useState(0)

  const registerTitle = React.useCallback(() => {
    setTitleCount((count) => count + 1)
    return () => setTitleCount((count) => count - 1)
  }, [])

  const hasTitle = titleCount > 0

  const context = React.useMemo<PopoverRootContextValue>(
    () => ({
      root,
      titleId: `${root.id}-title`,
      descriptionId: `${root.id}-description`,
      titleRef,
      hasTitle,
      registerTitle,
    }),
    [root, hasTitle, registerTitle]
  )

  return (
    <PopoverRootContext.Provider value={context}>
      {children}
    </PopoverRootContext.Provider>
  )
}

Root.displayName = "PopoverRoot"

interface TriggerState {
  open: boolean
  disabled: boolean
}

type TriggerProps = BaseUIComponentProps<typeof Pressable, TriggerState>

function Trigger({
  render,
  className,
  style,
  ref,
  disabled,
  ...elementProps
}: TriggerProps) {
  const { root } = usePopoverRootContext("PopoverTrigger")
  const trigger = useFloatingTrigger({
    root,
    ref,
    disabled: disabled ?? undefined,
  })
  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state: trigger.state,
    ref: trigger.ref,
    props: [trigger.props, elementProps],
  })
}

Trigger.displayName = "PopoverTrigger"

interface PortalProps extends PortalParameters {
  children?: React.ReactNode
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const context = usePopoverRootContext("PopoverPortal")
  return (
    <FloatingPortal
      root={context.root}
      keepMounted={keepMounted}
      hostName={hostName}
    >
      <PopoverRootContext.Provider value={context}>
        {children}
      </PopoverRootContext.Provider>
    </FloatingPortal>
  )
}

Portal.displayName = "PopoverPortal"

type PositionerProps = Omit<
  BasePositionerProps,
  "root" | "dismissOnOutsidePress"
>

function Positioner(props: PositionerProps) {
  const { root } = usePopoverRootContext("PopoverPositioner")
  return <BasePositioner root={root} {...props} />
}

Positioner.displayName = "PopoverPositioner"

interface PopupState {
  open: boolean
  side: Side
  align: Align
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState> & {
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
}

function claimResponder() {
  return true
}

function Popup({
  initialFocus,
  finalFocus,
  render,
  className,
  style,
  ref,
  ...elementProps
}: PopupProps) {
  const { root, titleId, titleRef, hasTitle } =
    usePopoverRootContext("PopoverPopup")
  const { side, align, isPositioned } = usePositionerContext("PopoverPopup")
  const { open } = root
  const popup = useFloatingPopup({
    root,
    ref,
    role: "dialog",
    ready: isPositioned,
    initialFocus: initialFocus ?? titleRef,
    finalFocus,
  })

  const state = React.useMemo<PopupState>(
    () => ({ open, side, align }),
    [open, side, align]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: popup.ref,
    props: [
      popup.props,
      {
        accessibilityLabelledBy: hasTitle ? titleId : undefined,
        onStartShouldSetResponder: claimResponder,
      },
      elementProps,
    ],
  })
}

Popup.displayName = "PopoverPopup"

interface ArrowState {
  open: boolean
  side: Side
  align: Align
  uncentered: boolean
}

type ArrowProps = BaseUIComponentProps<typeof View, ArrowState>

function Arrow({ render, className, style, ref, ...elementProps }: ArrowProps) {
  const { open, side, align, arrow, arrowStyle, setArrowSize } =
    usePositionerContext("Arrow")

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout
      setArrowSize({ width, height })
    },
    [setArrowSize]
  )

  React.useEffect(() => () => setArrowSize(null), [setArrowSize])

  const state = React.useMemo<ArrowState>(
    () => ({ open, side, align, uncentered: arrow.uncentered }),
    [open, side, align, arrow.uncentered]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessible: false,
        importantForAccessibility: "no",
        onLayout,
        style: { ...arrowStyle, pointerEvents: "none" },
      },
      elementProps,
    ],
  })
}

Arrow.displayName = "PopoverArrow"

type TitleState = Record<never, never>

type TitleProps = BaseUIComponentProps<typeof Text, TitleState>

const EMPTY_STATE: TitleState = {}

function Title({ render, className, style, ref, ...elementProps }: TitleProps) {
  const { titleId, titleRef, registerTitle } =
    usePopoverRootContext("PopoverTitle")

  React.useLayoutEffect(() => registerTitle(), [registerTitle])

  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref: [ref, titleRef],
    props: [{ role: "heading", nativeID: titleId }, elementProps],
  })
}

Title.displayName = "PopoverTitle"

type DescriptionState = Record<never, never>

type DescriptionProps = BaseUIComponentProps<typeof Text, DescriptionState>

function Description({
  render,
  className,
  style,
  ref,
  ...elementProps
}: DescriptionProps) {
  const { descriptionId } = usePopoverRootContext("PopoverDescription")
  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [{ nativeID: descriptionId }, elementProps],
  })
}

Description.displayName = "PopoverDescription"

interface CloseState {
  disabled: boolean
}

type CloseProps = BaseUIComponentProps<typeof Pressable, CloseState>

function Close({
  render,
  className,
  style,
  ref,
  disabled: disabledProp,
  ...elementProps
}: CloseProps) {
  const { root } = usePopoverRootContext("PopoverClose")
  const { setOpen } = root
  const disabled = disabledProp ?? false

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      setOpen(false, REASONS.closePress, event)
    },
    [disabled, setOpen]
  )

  const state = React.useMemo<CloseState>(() => ({ disabled }), [disabled])

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "button",
        accessibilityState: { disabled },
        disabled: disabled || undefined,
        onPress,
      },
      elementProps,
    ],
  })
}

Close.displayName = "PopoverClose"

export type {
  ArrowProps,
  ArrowState,
  ChangeEventDetails,
  CloseProps,
  CloseState,
  DescriptionProps,
  DescriptionState,
  OpenChangeReason,
  PopoverRootContextValue,
  PopupProps,
  PopupState,
  PortalProps,
  PositionerProps,
  PositionerState,
  RootActions,
  RootProps,
  TitleProps,
  TitleState,
  TriggerProps,
  TriggerState,
}
export {
  Arrow,
  Close,
  Description,
  PopoverRootContext,
  Popup,
  Portal,
  Positioner,
  Root,
  Title,
  Trigger,
  usePopoverRootContext,
}
