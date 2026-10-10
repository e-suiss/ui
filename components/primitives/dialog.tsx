import * as React from "react"
import {
  type GestureResponderEvent,
  type HostInstance,
  Pressable,
  Text,
  View,
  type ViewStyle,
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
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  PortalParameters,
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
  disablePointerDismissal?: boolean | undefined
  children?: React.ReactNode
}

interface DialogRootContextValue {
  root: FloatingRootValue
  role: "dialog" | "alertdialog"
  disablePointerDismissal: boolean
  nested: boolean
  titleId: string
  descriptionId: string
  titleRef: React.RefObject<HostInstance | null>
  hasTitle: boolean
  registerTitle: () => () => void
}

const DialogRootContext = React.createContext<DialogRootContextValue | null>(
  null
)

function useDialogRootContext(componentName = "Dialog part") {
  const context = React.useContext(DialogRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Dialog.Root`)
  }
  return context
}

interface UseDialogRootParameters extends Omit<RootProps, "children"> {
  role: "dialog" | "alertdialog"
}

function useDialogRoot({
  role,
  modal = true,
  disablePointerDismissal = false,
  open,
  defaultOpen,
  onOpenChange,
  onOpenChangeComplete,
  actionsRef,
}: UseDialogRootParameters): DialogRootContextValue {
  const parent = React.useContext(DialogRootContext)
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

  const nested = parent !== null
  const hasTitle = titleCount > 0

  return React.useMemo<DialogRootContextValue>(
    () => ({
      root,
      role,
      disablePointerDismissal,
      nested,
      titleId: `${root.id}-title`,
      descriptionId: `${root.id}-description`,
      titleRef,
      hasTitle,
      registerTitle,
    }),
    [root, role, disablePointerDismissal, nested, hasTitle, registerTitle]
  )
}

function Root({ children, ...parameters }: RootProps) {
  const context = useDialogRoot({ ...parameters, role: "dialog" })
  return (
    <DialogRootContext.Provider value={context}>
      {children}
    </DialogRootContext.Provider>
  )
}

Root.displayName = "DialogRoot"

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
  const { root } = useDialogRootContext("DialogTrigger")
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

Trigger.displayName = "DialogTrigger"

interface PortalProps extends PortalParameters {
  children?: React.ReactNode
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const context = useDialogRootContext("DialogPortal")
  return (
    <FloatingPortal
      root={context.root}
      keepMounted={keepMounted}
      hostName={hostName}
    >
      <DialogRootContext.Provider value={context}>
        {children}
      </DialogRootContext.Provider>
    </FloatingPortal>
  )
}

Portal.displayName = "DialogPortal"

interface BackdropState {
  open: boolean
}

type BackdropProps = BaseUIComponentProps<typeof Pressable, BackdropState>

function Backdrop({
  render,
  className,
  style,
  ref,
  ...elementProps
}: BackdropProps) {
  const { root, disablePointerDismissal } =
    useDialogRootContext("DialogBackdrop")
  const { open, setOpen } = root

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disablePointerDismissal) return
      setOpen(false, REASONS.outsidePress, event)
    },
    [disablePointerDismissal, setOpen]
  )

  const state = React.useMemo<BackdropState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    enabled: open,
    props: [
      { accessible: false, importantForAccessibility: "no", onPress },
      elementProps,
    ],
  })
}

Backdrop.displayName = "DialogBackdrop"

interface PopupState {
  open: boolean
  nested: boolean
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState> & {
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
}

const HIDDEN_STYLE: ViewStyle = { display: "none" }

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
  const { root, role, nested, titleId, titleRef, hasTitle } =
    useDialogRootContext("DialogPopup")
  const { open } = root
  const popup = useFloatingPopup({
    root,
    ref,
    role,
    initialFocus: initialFocus ?? titleRef,
    finalFocus,
  })

  const state = React.useMemo<PopupState>(
    () => ({ open, nested }),
    [open, nested]
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
      open ? undefined : { style: HIDDEN_STYLE },
    ],
  })
}

Popup.displayName = "DialogPopup"

type TitleState = Record<never, never>

type TitleProps = BaseUIComponentProps<typeof Text, TitleState>

const EMPTY_STATE: TitleState = {}

function Title({ render, className, style, ref, ...elementProps }: TitleProps) {
  const { titleId, titleRef, registerTitle } =
    useDialogRootContext("DialogTitle")

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

Title.displayName = "DialogTitle"

type DescriptionState = Record<never, never>

type DescriptionProps = BaseUIComponentProps<typeof Text, DescriptionState>

function Description({
  render,
  className,
  style,
  ref,
  ...elementProps
}: DescriptionProps) {
  const { descriptionId } = useDialogRootContext("DialogDescription")
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

Description.displayName = "DialogDescription"

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
  const { root } = useDialogRootContext("DialogClose")
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

Close.displayName = "DialogClose"

export type {
  BackdropProps,
  BackdropState,
  ChangeEventDetails,
  CloseProps,
  CloseState,
  DescriptionProps,
  DescriptionState,
  DialogRootContextValue,
  OpenChangeReason,
  PopupProps,
  PopupState,
  PortalProps,
  RootActions,
  RootProps,
  TitleProps,
  TitleState,
  TriggerProps,
  TriggerState,
  UseDialogRootParameters,
}
export {
  Backdrop,
  Close,
  Description,
  DialogRootContext,
  Popup,
  Portal,
  Root,
  Title,
  Trigger,
  useDialogRoot,
  useDialogRootContext,
}
