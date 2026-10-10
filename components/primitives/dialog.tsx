import * as React from "react"
import {
  type GestureResponderEvent,
  Pressable,
  Text as RNText,
  View,
} from "react-native"
import {
  useAccessibilityFocus,
  useAugmentedRef,
  useBackHandler,
  useComposedRefs,
  useControllableState,
  useRestoreAccessibilityFocus,
} from "./hooks"
import { Portal as PortalPrimitive } from "./portal"
import { Slot } from "./slot"
import type {
  ForceMountable,
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  SlottableViewProps,
  TextRef,
  TriggerRef,
  ViewRef,
} from "./types"

type RootProps = SlottableViewProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

interface PortalProps extends ForceMountable {
  children: React.ReactNode
  hostName?: string
}

type OverlayProps = ForceMountable &
  SlottablePressableProps & {
    closeOnPress?: boolean
  }

type TriggerProps = SlottablePressableProps
type ContentProps = ForceMountable & SlottableViewProps
type CloseProps = SlottablePressableProps
type TitleProps = SlottableTextProps
type DescriptionProps = SlottableTextProps

type RootRef = ViewRef
type OverlayRef = PressableRef
type ContentRef = ViewRef
type CloseRef = PressableRef
type TitleRef = TextRef
type DescriptionRef = TextRef

interface RootContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  nativeID: string
  titleID: string
  descriptionID: string
  hasTitle: boolean
  registerTitle: () => () => void
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Dialog compound components cannot be rendered outside the Dialog component"
    )
  }
  return context
}

function Root({
  asChild,
  open: openProp,
  defaultOpen,
  onOpenChange: onOpenChangeProp,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const nativeID = React.useId()
  const [titleCount, setTitleCount] = React.useState(0)
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  })

  const onOpenChange = React.useCallback(
    (value: boolean) => setOpen(value),
    [setOpen]
  )

  const registerTitle = React.useCallback(() => {
    setTitleCount((count) => count + 1)
    return () => setTitleCount((count) => count - 1)
  }, [])

  const value = React.useMemo<RootContextValue>(
    () => ({
      open,
      onOpenChange,
      nativeID,
      titleID: `${nativeID}_title`,
      descriptionID: `${nativeID}_description`,
      hasTitle: titleCount > 0,
      registerTitle,
    }),
    [open, onOpenChange, nativeID, titleCount, registerTitle]
  )

  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={value}>
      <Component ref={ref} {...props} />
    </RootContext.Provider>
  )
}

Root.displayName = "DialogRoot"

function Trigger({
  asChild,
  onPress: onPressProp,
  disabled,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const { open, onOpenChange } = useRootContext()
  const augmentedRef = useAugmentedRef<TriggerRef>({
    ref,
    methods: {
      open: () => onOpenChange(true),
      close: () => onOpenChange(false),
    },
  })
  useRestoreAccessibilityFocus(open, augmentedRef)

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onOpenChange(!open)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={augmentedRef}
      role="button"
      aria-disabled={disabled ?? undefined}
      accessibilityState={{ disabled: disabled ?? false }}
      disabled={disabled ?? undefined}
      onPress={onPress}
      {...props}
    />
  )
}

Trigger.displayName = "DialogTrigger"

function Portal({ forceMount, hostName, children }: PortalProps) {
  const value = useRootContext()

  if (!forceMount && !value.open) return null

  return (
    <PortalPrimitive hostName={hostName} name={`${value.nativeID}_portal`}>
      <RootContext.Provider value={value}>{children}</RootContext.Provider>
    </PortalPrimitive>
  )
}

Portal.displayName = "DialogPortal"

function Overlay({
  asChild,
  forceMount,
  closeOnPress = true,
  onPress: onPressProp,
  ref,
  ...props
}: OverlayProps & React.RefAttributes<OverlayRef>) {
  const { open, onOpenChange } = useRootContext()

  function onPress(event: GestureResponderEvent) {
    if (closeOnPress) onOpenChange(false)
    onPressProp?.(event)
  }

  if (!forceMount && !open) return null

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return <Component ref={ref} accessible={false} onPress={onPress} {...props} />
}

Overlay.displayName = "DialogOverlay"

function claimResponder() {
  return true
}

function Content({
  asChild,
  forceMount,
  ref,
  ...props
}: ContentProps & React.RefAttributes<ContentRef>) {
  const { open, onOpenChange, titleID, hasTitle } = useRootContext()
  const focusRef = useAccessibilityFocus<ContentRef>(open && !hasTitle)
  const composedRef = useComposedRefs<ContentRef>(ref, focusRef)

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])
  useBackHandler(open, close)

  if (!forceMount && !open) return null

  const Component = asChild ? Slot : View
  return (
    <Component
      ref={composedRef}
      role="dialog"
      aria-modal
      accessibilityViewIsModal
      aria-labelledby={hasTitle ? titleID : undefined}
      onAccessibilityEscape={close}
      onStartShouldSetResponder={claimResponder}
      {...props}
    />
  )
}

Content.displayName = "DialogContent"

function Close({
  asChild,
  onPress: onPressProp,
  disabled,
  ref,
  ...props
}: CloseProps & React.RefAttributes<CloseRef>) {
  const { onOpenChange } = useRootContext()

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onOpenChange(false)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={ref}
      role="button"
      aria-disabled={disabled ?? undefined}
      accessibilityState={{ disabled: disabled ?? false }}
      disabled={disabled ?? undefined}
      onPress={onPress}
      {...props}
    />
  )
}

Close.displayName = "DialogClose"

function Title({
  asChild,
  ref,
  ...props
}: TitleProps & React.RefAttributes<TitleRef>) {
  const { open, titleID, registerTitle } = useRootContext()
  const focusRef = useAccessibilityFocus<TitleRef>(open)
  const composedRef = useComposedRefs<TitleRef>(ref, focusRef)

  React.useLayoutEffect(() => registerTitle(), [registerTitle])

  const Component = asChild ? Slot : RNText
  return (
    <Component ref={composedRef} role="heading" nativeID={titleID} {...props} />
  )
}

Title.displayName = "DialogTitle"

function Description({
  asChild,
  ref,
  ...props
}: DescriptionProps & React.RefAttributes<DescriptionRef>) {
  const { descriptionID } = useRootContext()
  const Component = asChild ? Slot : RNText
  return <Component ref={ref} nativeID={descriptionID} {...props} />
}

Description.displayName = "DialogDescription"

export type {
  CloseProps,
  CloseRef,
  ContentProps,
  ContentRef,
  DescriptionProps,
  DescriptionRef,
  OverlayProps,
  OverlayRef,
  PortalProps,
  RootContextValue,
  RootProps,
  RootRef,
  TitleProps,
  TitleRef,
  TriggerProps,
  TriggerRef,
}
export {
  Close,
  Content,
  Description,
  Overlay,
  Portal,
  Root,
  Title,
  Trigger,
  useRootContext,
}
