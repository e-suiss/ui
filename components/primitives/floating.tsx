import * as React from "react"
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type LayoutRectangle,
  Pressable,
  type Role,
  useWindowDimensions,
  View,
} from "react-native"
import {
  type LayoutPosition,
  measureLayoutPosition,
  useAccessibilityFocus,
  useAugmentedRef,
  useBackHandler,
  useComposedRefs,
  useControllableState,
  useRelativePosition,
  useRestoreAccessibilityFocus,
} from "./hooks"
import { Portal as PortalPrimitive } from "./portal"
import { Slot } from "./slot"
import type {
  ForceMountable,
  PositionedContentProps,
  PressableRef,
  SlottablePressableProps,
  SlottableViewProps,
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
type ContentProps = SlottableViewProps & PositionedContentProps
type CloseProps = SlottablePressableProps

type RootRef = ViewRef
type OverlayRef = PressableRef
type ContentRef = ViewRef
type CloseRef = PressableRef

interface RootContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  nativeID: string
  triggerRef: React.RefObject<PressableRef | null>
  triggerPosition: LayoutPosition | null
  setTriggerPosition: (position: LayoutPosition | null) => void
  contentLayout: LayoutRectangle | null
  setContentLayout: (layout: LayoutRectangle | null) => void
}

interface FloatingOptions {
  name: string
  role: Role
  modal: boolean
  accessibleContent: boolean
}

function claimResponder() {
  return true
}

function isSameSize(
  previous: LayoutRectangle | null,
  next: LayoutRectangle | null
) {
  if (!previous || !next) return previous === next
  return previous.width === next.width && previous.height === next.height
}

function createFloating({
  name,
  role,
  modal,
  accessibleContent,
}: FloatingOptions) {
  const RootContext = React.createContext<RootContextValue | null>(null)

  function useRootContext() {
    const context = React.useContext(RootContext)
    if (!context) {
      throw new Error(
        `${name} compound components cannot be rendered outside the ${name} component`
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
    const triggerRef = React.useRef<PressableRef>(null)
    const window = useWindowDimensions()
    const [triggerPosition, setTriggerPosition] =
      React.useState<LayoutPosition | null>(null)
    const [contentLayout, setContentLayoutState] =
      React.useState<LayoutRectangle | null>(null)
    const [open = false, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen,
      onChange: onOpenChangeProp,
    })

    const onOpenChange = React.useCallback(
      (value: boolean) => setOpen(value),
      [setOpen]
    )

    const setContentLayout = React.useCallback(
      (layout: LayoutRectangle | null) => {
        setContentLayoutState((previous) =>
          isSameSize(previous, layout) ? previous : layout
        )
      },
      []
    )

    React.useEffect(() => {
      if (!open) {
        setTriggerPosition(null)
        setContentLayoutState(null)
        return
      }
      if (window.width <= 0 || window.height <= 0) return
      measureLayoutPosition(triggerRef.current, setTriggerPosition)
    }, [open, window.width, window.height])

    const value = React.useMemo<RootContextValue>(
      () => ({
        open,
        onOpenChange,
        nativeID,
        triggerRef,
        triggerPosition,
        setTriggerPosition,
        contentLayout,
        setContentLayout,
      }),
      [
        open,
        onOpenChange,
        nativeID,
        triggerPosition,
        contentLayout,
        setContentLayout,
      ]
    )

    const Component = asChild ? Slot : View
    return (
      <RootContext.Provider value={value}>
        <Component ref={ref} {...props} />
      </RootContext.Provider>
    )
  }

  Root.displayName = `${name}Root`

  function Trigger({
    asChild,
    onPress: onPressProp,
    disabled,
    ref,
    ...props
  }: TriggerProps & React.RefAttributes<TriggerRef>) {
    const { open, onOpenChange, triggerRef } = useRootContext()
    const augmentedRef = useAugmentedRef<TriggerRef>({
      ref,
      methods: {
        open: () => onOpenChange(true),
        close: () => onOpenChange(false),
      },
    })
    const composedRef = useComposedRefs<TriggerRef>(augmentedRef, triggerRef)
    useRestoreAccessibilityFocus(open, augmentedRef)

    function onPress(event: GestureResponderEvent) {
      if (disabled) return
      onOpenChange(!open)
      onPressProp?.(event)
    }

    const Component = (asChild ? Slot : Pressable) as typeof Pressable
    return (
      <Component
        ref={composedRef}
        role="button"
        aria-disabled={disabled ?? undefined}
        aria-expanded={open}
        accessibilityState={{ disabled: disabled ?? false, expanded: open }}
        disabled={disabled ?? undefined}
        onPress={onPress}
        {...props}
      />
    )
  }

  Trigger.displayName = `${name}Trigger`

  function Portal({ forceMount, hostName, children }: PortalProps) {
    const value = useRootContext()

    if (!forceMount && !value.open) return null

    return (
      <PortalPrimitive hostName={hostName} name={`${value.nativeID}_portal`}>
        <RootContext.Provider value={value}>{children}</RootContext.Provider>
      </PortalPrimitive>
    )
  }

  Portal.displayName = `${name}Portal`

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
    return (
      <Component ref={ref} accessible={false} onPress={onPress} {...props} />
    )
  }

  Overlay.displayName = `${name}Overlay`

  function Content({
    asChild,
    forceMount,
    side = "bottom",
    align = "start",
    sideOffset = 0,
    alignOffset = 0,
    avoidCollisions = true,
    insets,
    disablePositioningStyle,
    style,
    onLayout: onLayoutProp,
    ref,
    ...props
  }: ContentProps & React.RefAttributes<ContentRef>) {
    const {
      open,
      onOpenChange,
      triggerPosition,
      contentLayout,
      setContentLayout,
    } = useRootContext()
    const focusRef = useAccessibilityFocus<ContentRef>(
      open && triggerPosition !== null
    )
    const composedRef = useComposedRefs<ContentRef>(ref, focusRef)

    const close = React.useCallback(() => onOpenChange(false), [onOpenChange])
    useBackHandler(open, close)

    const positionStyle = useRelativePosition({
      triggerPosition,
      contentLayout,
      side,
      align,
      sideOffset,
      alignOffset,
      avoidCollisions,
      insets,
      disablePositioningStyle,
    })

    function onLayout(event: LayoutChangeEvent) {
      setContentLayout(event.nativeEvent.layout)
      onLayoutProp?.(event)
    }

    if (!forceMount && !open) return null

    const Component = asChild ? Slot : View
    return (
      <Component
        ref={composedRef}
        role={role}
        aria-modal={modal || undefined}
        accessibilityViewIsModal={modal}
        accessible={accessibleContent || undefined}
        onAccessibilityEscape={close}
        onStartShouldSetResponder={claimResponder}
        style={[positionStyle, style]}
        onLayout={onLayout}
        {...props}
      />
    )
  }

  Content.displayName = `${name}Content`

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

  Close.displayName = `${name}Close`

  return {
    Close,
    Content,
    Overlay,
    Portal,
    Root,
    Trigger,
    useRootContext,
  }
}

export type {
  CloseProps,
  CloseRef,
  ContentProps,
  ContentRef,
  FloatingOptions,
  OverlayProps,
  OverlayRef,
  PortalProps,
  RootContextValue,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
}
export { createFloating }
