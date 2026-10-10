import * as React from "react"
import {
  AccessibilityInfo,
  type GestureResponderEvent,
  Pressable,
  View,
} from "react-native"
import { useAugmentedRef, useComposedRefs, useEffectEvent } from "./hooks"
import {
  type AnchoredLayout,
  FloatingContent as FloatingContentPrimitive,
  type FloatingContentProps,
  FloatingOverlay,
  type OverlayProps,
  type OverlayRef,
  useAnchoredLayout,
} from "./menu-core"
import { Portal as PortalPrimitive } from "./portal"
import { Slot } from "./slot"
import type {
  ForceMountable,
  PressableRef,
  SlottablePressableProps,
  SlottableViewProps,
  TriggerRef,
  ViewRef,
} from "./types"

type RootProps = SlottableViewProps & {
  value?: string | undefined
  defaultValue?: string
  onValueChange?: (value: string | undefined) => void
}

type MenuProps = SlottableViewProps & {
  value: string | undefined
}

type TriggerProps = SlottablePressableProps

interface PortalProps extends ForceMountable {
  children: React.ReactNode
  hostName?: string
}

type ContentProps = FloatingContentProps

type RootRef = ViewRef
type MenuRef = ViewRef
type ContentRef = ViewRef

interface RootContextValue {
  value: string | undefined
  onValueChange: (value: string | undefined) => void
  nativeID: string
  registerTrigger: (menuValue: string, node: PressableRef | null) => void
}

interface MenuContextValue extends AnchoredLayout {
  value: string | undefined
  open: boolean
  menuID: string
  triggerRef: React.RefObject<PressableRef | null>
}

const RootContext = React.createContext<RootContextValue | null>(null)
const MenuContext = React.createContext<MenuContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Menubar compound components cannot be rendered outside the Menubar component"
    )
  }
  return context
}

function useMenuContext() {
  const context = React.useContext(MenuContext)
  if (!context) {
    throw new Error(
      "Menubar menu components cannot be rendered outside a Menubar Menu component"
    )
  }
  return context
}

function useRestoreTriggerFocus(
  value: string | undefined,
  triggers: React.RefObject<Map<string, PressableRef>>
) {
  const previousRef = React.useRef(value)

  React.useEffect(() => {
    const previous = previousRef.current
    previousRef.current = value
    if (previous === undefined || value !== undefined) return
    const node = triggers.current.get(previous)
    if (!node) return
    const timeout = setTimeout(() => {
      AccessibilityInfo.sendAccessibilityEvent(node, "focus")
    }, 50)
    return () => clearTimeout(timeout)
  }, [value, triggers])
}

function Root({
  asChild,
  value: valueProp,
  defaultValue,
  onValueChange: onValueChangeProp,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const nativeID = React.useId()
  const triggers = React.useRef(new Map<string, PressableRef>())
  const [uncontrolledValue, setUncontrolledValue] = React.useState<
    string | undefined
  >(defaultValue)
  const isControlled =
    valueProp !== undefined || onValueChangeProp !== undefined
  const value = isControlled ? valueProp : uncontrolledValue

  const onValueChange = useEffectEvent((next: string | undefined) => {
    if (!isControlled) setUncontrolledValue(next)
    onValueChangeProp?.(next)
  })

  const registerTrigger = React.useCallback(
    (menuValue: string, node: PressableRef | null) => {
      if (node) triggers.current.set(menuValue, node)
      else triggers.current.delete(menuValue)
    },
    []
  )

  useRestoreTriggerFocus(value, triggers)

  const context = React.useMemo(
    () => ({ value, onValueChange, nativeID, registerTrigger }),
    [value, onValueChange, nativeID, registerTrigger]
  )

  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={context}>
      <Component ref={ref} role="menubar" {...props} />
    </RootContext.Provider>
  )
}

Root.displayName = "MenubarRoot"

function Menu({
  asChild,
  value,
  ref,
  ...props
}: MenuProps & React.RefAttributes<MenuRef>) {
  const root = useRootContext()
  const menuID = React.useId()
  const triggerRef = React.useRef<PressableRef>(null)
  const open = value !== undefined && root.value === value
  const layout = useAnchoredLayout(open, triggerRef)

  const context = React.useMemo(
    () => ({ ...layout, value, open, menuID, triggerRef }),
    [layout, value, open, menuID]
  )

  const Component = asChild ? Slot : View
  return (
    <MenuContext.Provider value={context}>
      <Component ref={ref} {...props} />
    </MenuContext.Provider>
  )
}

Menu.displayName = "MenubarMenu"

function Trigger({
  asChild,
  disabled,
  onPress: onPressProp,
  ref,
  ...props
}: TriggerProps & React.RefAttributes<TriggerRef>) {
  const { onValueChange, registerTrigger } = useRootContext()
  const menu = useMenuContext()
  const menuValue = menu.value

  const augmentedRef = useAugmentedRef<TriggerRef>({
    ref,
    methods: {
      open: () => onValueChange(menuValue),
      close: () => onValueChange(undefined),
    },
  })
  const registerRef = React.useCallback(
    (node: PressableRef | null) => {
      if (menuValue === undefined) return
      registerTrigger(menuValue, node)
      return () => registerTrigger(menuValue, null)
    },
    [menuValue, registerTrigger]
  )
  const composedRef = useComposedRefs<TriggerRef>(
    augmentedRef,
    menu.triggerRef,
    registerRef
  )

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onValueChange(menu.open ? undefined : menuValue)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={composedRef}
      role="menuitem"
      aria-haspopup="menu"
      aria-expanded={menu.open}
      aria-disabled={!!disabled}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Trigger.displayName = "MenubarTrigger"

function Portal({ forceMount, hostName, children }: PortalProps) {
  const root = useRootContext()
  const menu = useMenuContext()
  if (!forceMount && !menu.open) return null
  return (
    <PortalPrimitive
      hostName={hostName}
      name={`${root.nativeID}_${menu.menuID}_portal`}
    >
      <RootContext.Provider value={root}>
        <MenuContext.Provider value={menu}>{children}</MenuContext.Provider>
      </RootContext.Provider>
    </PortalPrimitive>
  )
}

Portal.displayName = "MenubarPortal"

function useCloseMenubar() {
  const { onValueChange } = useRootContext()
  return React.useCallback(() => onValueChange(undefined), [onValueChange])
}

function Overlay(props: OverlayProps & React.RefAttributes<OverlayRef>) {
  const { value } = useRootContext()
  const close = useCloseMenubar()
  return <FloatingOverlay open={value !== undefined} close={close} {...props} />
}

Overlay.displayName = "MenubarOverlay"

function Content(props: ContentProps & React.RefAttributes<ContentRef>) {
  const menu = useMenuContext()
  const close = useCloseMenubar()
  const state = React.useMemo(
    () => ({
      open: menu.open,
      close,
      triggerPosition: menu.triggerPosition,
      contentLayout: menu.contentLayout,
      setContentLayout: menu.setContentLayout,
    }),
    [
      menu.open,
      close,
      menu.triggerPosition,
      menu.contentLayout,
      menu.setContentLayout,
    ]
  )
  return <FloatingContentPrimitive state={state} role="menu" {...props} />
}

Content.displayName = "MenubarContent"

export type {
  CheckboxItemProps,
  CheckboxItemRef,
  GroupProps,
  GroupRef,
  ItemIndicatorProps,
  ItemIndicatorRef,
  ItemProps,
  ItemRef,
  LabelProps,
  LabelRef,
  OverlayProps,
  OverlayRef,
  RadioGroupProps,
  RadioGroupRef,
  RadioItemProps,
  RadioItemRef,
  SeparatorProps,
  SeparatorRef,
  SubProps,
  SubRef,
  SubTriggerProps,
  SubTriggerRef,
  ViewSubContentProps as SubContentProps,
  ViewSubContentRef as SubContentRef,
} from "./menu-core"
export {
  CheckboxItem,
  Group,
  Item,
  ItemIndicator,
  Label,
  RadioGroup,
  RadioItem,
  Separator,
  Sub,
  SubTrigger,
  useSubContext,
  ViewSubContent as SubContent,
} from "./menu-core"
export type {
  ContentProps,
  ContentRef,
  MenuContextValue,
  MenuProps,
  MenuRef,
  PortalProps,
  RootContextValue,
  RootProps,
  RootRef,
  TriggerProps,
  TriggerRef,
}
export {
  Content,
  Menu,
  Overlay,
  Portal,
  Root,
  Trigger,
  useMenuContext,
  useRootContext,
}
