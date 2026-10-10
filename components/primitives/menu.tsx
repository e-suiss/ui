import * as React from "react"
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native"
import {
  type BaseUIEventReason,
  createChangeEventDetails,
  REASONS,
} from "./event-details"
import {
  FloatingHandle,
  FloatingPortal,
  type FloatingRootActions,
  FloatingRootContext,
  type FloatingRootValue,
  type FloatingViewportState,
  type FocusTarget,
  resolvePayloadChildren,
  useFloatingPopup,
  useFloatingRoot,
  useFloatingTrigger,
  useFloatingViewportState,
} from "./floating-root"
import {
  PositionerContext,
  Positioner as PositionerPrimitive,
  type PositionerProps as PositionerPrimitiveProps,
  useOptionalPositionerContext,
  usePositionerContext,
} from "./positioner"
import type {
  Align,
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  ChangeEvent,
  Orientation,
  PayloadChildRenderFunction,
  Side,
} from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type MenuChangeEventReason = BaseUIEventReason

type MenuChangeEventDetails = BaseUIChangeEventDetails<MenuChangeEventReason>

type MenuParentType = "menu" | "context-menu" | undefined

interface MenuRootContextValue {
  floating: FloatingRootValue
  nested: boolean
  parent: MenuParentType
  closeTree: (reason: MenuChangeEventReason, event?: ChangeEvent) => void
}

const MenuRootContext = React.createContext<MenuRootContextValue | null>(null)

function useMenuRootContext(componentName = "Menu part") {
  const context = React.useContext(MenuRootContext)
  if (!context) {
    throw new Error(`${componentName} must be rendered inside Menu.Root`)
  }
  return context
}

class Handle<Payload = unknown> extends FloatingHandle<Payload> {}

function createHandle<Payload = unknown>(): Handle<Payload> {
  return new Handle<Payload>()
}

interface RootProps<Payload = unknown> {
  children?: React.ReactNode | PayloadChildRenderFunction<Payload>
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?:
    | ((open: boolean, details: MenuChangeEventDetails) => void)
    | undefined
  onOpenChangeComplete?: ((open: boolean) => void) | undefined
  actionsRef?: React.RefObject<FloatingRootActions | null> | undefined
  modal?: boolean | undefined
  disabled?: boolean | undefined
  triggerId?: string | null | undefined
  defaultTriggerId?: string | null | undefined
  handle?: Handle<Payload> | undefined
}

interface InternalRootProps<Payload = unknown> extends RootProps<Payload> {
  parent?: MenuParentType
}

function MenuRootImpl<Payload = unknown>({
  children,
  modal,
  disabled,
  parent: parentType,
  ...parameters
}: InternalRootProps<Payload>) {
  const floating = useFloatingRoot<MenuChangeEventReason>({
    ...parameters,
    modal: modal ?? true,
    disabled: disabled ?? false,
  })

  const { setOpen } = floating
  const closeTree = React.useCallback(
    (reason: MenuChangeEventReason, event?: ChangeEvent) => {
      setOpen(false, reason, event)
    },
    [setOpen]
  )

  const parent: MenuParentType = parentType ?? "menu"

  const value = React.useMemo<MenuRootContextValue>(
    () => ({ floating, nested: false, parent, closeTree }),
    [floating, parent, closeTree]
  )

  return (
    <MenuRootContext.Provider value={value}>
      <FloatingRootContext.Provider value={floating}>
        {resolvePayloadChildren(children, floating.payload)}
      </FloatingRootContext.Provider>
    </MenuRootContext.Provider>
  )
}

function Root<Payload = unknown>(props: RootProps<Payload>) {
  return <MenuRootImpl<Payload> {...props} />
}

Root.displayName = "MenuRoot"

interface SubmenuRootProps
  extends Omit<
    RootProps,
    "modal" | "children" | "handle" | "triggerId" | "defaultTriggerId"
  > {
  children?: React.ReactNode
}

function SubmenuRoot({ children, disabled, ...parameters }: SubmenuRootProps) {
  const parentMenu = useMenuRootContext("Menu.SubmenuRoot")
  const floating = useFloatingRoot<MenuChangeEventReason>({
    ...parameters,
    modal: false,
    disabled: disabled ?? false,
  })

  const parentOpen = parentMenu.floating.open
  const { open, setOpen } = floating

  React.useEffect(() => {
    if (!parentOpen && open) setOpen(false, REASONS.none)
  }, [parentOpen, open, setOpen])

  const value = React.useMemo<MenuRootContextValue>(
    () => ({
      floating,
      nested: true,
      parent: "menu",
      closeTree: parentMenu.closeTree,
    }),
    [floating, parentMenu.closeTree]
  )

  return (
    <MenuRootContext.Provider value={value}>
      <FloatingRootContext.Provider value={floating}>
        <PositionerContext.Provider value={null}>
          {children}
        </PositionerContext.Provider>
      </FloatingRootContext.Provider>
    </MenuRootContext.Provider>
  )
}

SubmenuRoot.displayName = "MenuSubmenuRoot"

function useHighlight() {
  const [highlighted, setHighlighted] = React.useState(false)
  const onPressIn = React.useCallback(() => setHighlighted(true), [])
  const onPressOut = React.useCallback(() => setHighlighted(false), [])
  return { highlighted, props: { onPressIn, onPressOut } }
}

interface TriggerState {
  open: boolean
  disabled: boolean
}

type TriggerProps<Payload = unknown> = Omit<
  BaseUIComponentProps<typeof Pressable, TriggerState>,
  "id"
> & {
  handle?: Handle<Payload> | undefined
  payload?: Payload | undefined
  id?: string | undefined
}

function Trigger<Payload = unknown>({
  handle,
  payload,
  id,
  disabled,
  render,
  className,
  style,
  ref,
  ...elementProps
}: TriggerProps<Payload>) {
  const menu = React.useContext(MenuRootContext)
  if (!menu && !handle) {
    throw new Error("Menu.Trigger must be rendered inside Menu.Root")
  }
  const trigger = useFloatingTrigger({
    root: menu?.floating,
    handle,
    id,
    payload,
    ref,
    disabled: disabled ?? undefined,
    role: "button",
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

Trigger.displayName = "MenuTrigger"

interface PortalProps {
  children?: React.ReactNode
  keepMounted?: boolean | undefined
  hostName?: string | undefined
}

function Portal({ children, keepMounted, hostName }: PortalProps) {
  const menu = useMenuRootContext("Menu.Portal")
  return (
    <FloatingPortal
      root={menu.floating}
      keepMounted={keepMounted}
      hostName={hostName}
    >
      <MenuRootContext.Provider value={menu}>
        {children}
      </MenuRootContext.Provider>
    </FloatingPortal>
  )
}

Portal.displayName = "MenuPortal"

type PositionerProps = Omit<PositionerPrimitiveProps, "root">

function Positioner({
  side = "bottom",
  align = "center",
  ...props
}: PositionerProps) {
  const menu = useMenuRootContext("Menu.Positioner")
  return (
    <PositionerPrimitive
      root={menu.floating}
      side={side}
      align={align}
      {...props}
    />
  )
}

Positioner.displayName = "MenuPositioner"

interface PopupState {
  open: boolean
  side: Side
  align: Align
  nested: boolean
}

type PopupProps = BaseUIComponentProps<typeof View, PopupState> & {
  initialFocus?: FocusTarget | undefined
  finalFocus?: FocusTarget | undefined
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
  const menu = useMenuRootContext("Menu.Popup")
  const positioner = useOptionalPositionerContext()
  const { open } = menu.floating
  const popup = useFloatingPopup({
    root: menu.floating,
    ref,
    role: "menu",
    ready: positioner ? positioner.isPositioned : true,
    initialFocus,
    finalFocus,
  })

  const side = positioner?.side ?? "bottom"
  const align = positioner?.align ?? "start"
  const state = React.useMemo<PopupState>(
    () => ({ open, side, align, nested: menu.nested }),
    [open, side, align, menu.nested]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref: popup.ref,
    props: [popup.props, elementProps],
    enabled: open || positioner !== null,
  })
}

Popup.displayName = "MenuPopup"

type ViewportState = FloatingViewportState

type ViewportProps = BaseUIComponentProps<typeof View, ViewportState>

function Viewport({
  render,
  className,
  style,
  ref,
  ...elementProps
}: ViewportProps) {
  const menu = useMenuRootContext("Menu.Viewport")
  const state = useFloatingViewportState(menu.floating)
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: elementProps,
  })
}

Viewport.displayName = "MenuViewport"

interface ArrowState {
  open: boolean
  side: Side
  align: Align
  uncentered: boolean
}

type ArrowProps = BaseUIComponentProps<typeof View, ArrowState>

function Arrow({ render, className, style, ref, ...elementProps }: ArrowProps) {
  const positioner = usePositionerContext("Menu.Arrow")
  const { setArrowSize } = positioner

  const onLayout = React.useCallback(
    (event: LayoutChangeEvent) => {
      const { width, height } = event.nativeEvent.layout
      setArrowSize({ width, height })
    },
    [setArrowSize]
  )

  React.useEffect(() => () => setArrowSize(null), [setArrowSize])

  const state = React.useMemo<ArrowState>(
    () => ({
      open: positioner.open,
      side: positioner.side,
      align: positioner.align,
      uncentered: positioner.arrow.uncentered,
    }),
    [
      positioner.open,
      positioner.side,
      positioner.align,
      positioner.arrow.uncentered,
    ]
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
        style: positioner.arrowStyle,
        onLayout,
        pointerEvents: "none",
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Arrow.displayName = "MenuArrow"

interface BackdropState {
  open: boolean
}

type BackdropProps = BaseUIComponentProps<typeof View, BackdropState>

function Backdrop({
  render,
  className,
  style,
  ref,
  ...elementProps
}: BackdropProps) {
  const menu = useMenuRootContext("Menu.Backdrop")
  const { open } = menu.floating
  const state = React.useMemo<BackdropState>(() => ({ open }), [open])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        style: StyleSheet.absoluteFill,
        pointerEvents: "none",
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
    enabled: open,
  })
}

Backdrop.displayName = "MenuBackdrop"

interface ItemState {
  disabled: boolean
  highlighted: boolean
}

type ItemProps = BaseUIComponentProps<typeof Pressable, ItemState> & {
  label?: string | undefined
  closeOnPress?: boolean | undefined
}

function Item({
  label,
  closeOnPress = true,
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ItemProps) {
  const { closeTree } = useMenuRootContext("Menu.Item")
  const disabled = !!disabledProp
  const highlight = useHighlight()

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled || !closeOnPress) return
      closeTree(REASONS.itemPress, event)
    },
    [disabled, closeOnPress, closeTree]
  )

  const state = React.useMemo<ItemState>(
    () => ({ disabled, highlighted: highlight.highlighted }),
    [disabled, highlight.highlighted]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "menuitem",
        accessibilityLabel: label,
        accessibilityState: { disabled },
        disabled: disabled || undefined,
        onPress,
        ...highlight.props,
      },
      elementProps,
    ],
  })
}

Item.displayName = "MenuItem"

interface CheckboxItemState {
  checked: boolean
  disabled: boolean
  highlighted: boolean
}

const CheckboxItemContext = React.createContext<CheckboxItemState | null>(null)

type CheckboxItemProps = BaseUIComponentProps<
  typeof Pressable,
  CheckboxItemState
> & {
  checked?: boolean | undefined
  defaultChecked?: boolean | undefined
  onCheckedChange?:
    | ((checked: boolean, details: MenuChangeEventDetails) => void)
    | undefined
  label?: string | undefined
  closeOnPress?: boolean | undefined
}

function CheckboxItem({
  checked: checkedProp,
  defaultChecked = false,
  onCheckedChange,
  label,
  closeOnPress = false,
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: CheckboxItemProps) {
  const { closeTree } = useMenuRootContext("Menu.CheckboxItem")
  const disabled = !!disabledProp
  const highlight = useHighlight()
  const [checked, setChecked] = useControllableState<
    boolean,
    MenuChangeEventDetails
  >({
    value: checkedProp,
    defaultValue: defaultChecked,
    onChange: onCheckedChange,
  })

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      setChecked(
        (previous) => !previous,
        createChangeEventDetails<MenuChangeEventReason>(
          REASONS.itemPress,
          event
        )
      )
      if (closeOnPress) closeTree(REASONS.itemPress, event)
    },
    [disabled, setChecked, closeOnPress, closeTree]
  )

  const state = React.useMemo<CheckboxItemState>(
    () => ({ checked, disabled, highlighted: highlight.highlighted }),
    [checked, disabled, highlight.highlighted]
  )

  const element = useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "checkbox",
        accessibilityLabel: label,
        accessibilityState: { checked, disabled },
        disabled: disabled || undefined,
        onPress,
        ...highlight.props,
      },
      elementProps,
    ],
  })

  return (
    <CheckboxItemContext.Provider value={state}>
      {element}
    </CheckboxItemContext.Provider>
  )
}

CheckboxItem.displayName = "MenuCheckboxItem"

type IndicatorProps<State> = BaseUIComponentProps<typeof View, State> & {
  keepMounted?: boolean | undefined
}

const HIDDEN_PROPS = {
  pointerEvents: "none",
  accessibilityElementsHidden: true,
  importantForAccessibility: "no-hide-descendants",
} as const

function CheckboxItemIndicator({
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps<CheckboxItemState>) {
  const item = React.useContext(CheckboxItemContext)
  if (!item) {
    throw new Error(
      "Menu.CheckboxItemIndicator must be rendered inside Menu.CheckboxItem"
    )
  }

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: item,
    ref,
    props: [HIDDEN_PROPS, elementProps],
    enabled: keepMounted || item.checked,
  })
}

CheckboxItemIndicator.displayName = "MenuCheckboxItemIndicator"

interface RadioGroupState {
  disabled: boolean
}

interface RadioGroupContextValue {
  value: unknown
  disabled: boolean
  setValue: (value: unknown, event: GestureResponderEvent) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
)

type RadioGroupProps<Value = unknown> = BaseUIComponentProps<
  typeof View,
  RadioGroupState
> & {
  value?: Value | undefined
  defaultValue?: Value | undefined
  onValueChange?:
    | ((value: Value, details: MenuChangeEventDetails) => void)
    | undefined
  disabled?: boolean | undefined
}

function RadioGroup<Value = unknown>({
  value: valueProp,
  defaultValue,
  onValueChange,
  disabled = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RadioGroupProps<Value>) {
  const [value, setValueState] = useControllableState<
    Value | undefined,
    MenuChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange as
      | ((value: Value | undefined, details: MenuChangeEventDetails) => void)
      | undefined,
  })

  const setValue = React.useCallback(
    (next: unknown, event: GestureResponderEvent) => {
      setValueState(
        next as Value,
        createChangeEventDetails<MenuChangeEventReason>(
          REASONS.itemPress,
          event
        )
      )
    },
    [setValueState]
  )

  const context = React.useMemo<RadioGroupContextValue>(
    () => ({ value, disabled, setValue }),
    [value, disabled, setValue]
  )

  const state = React.useMemo<RadioGroupState>(() => ({ disabled }), [disabled])

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      { role: "radiogroup", accessibilityState: { disabled } },
      elementProps,
    ],
  })

  return (
    <RadioGroupContext.Provider value={context}>
      {element}
    </RadioGroupContext.Provider>
  )
}

RadioGroup.displayName = "MenuRadioGroup"

interface RadioItemState {
  checked: boolean
  disabled: boolean
  highlighted: boolean
}

const RadioItemContext = React.createContext<RadioItemState | null>(null)

type RadioItemProps = BaseUIComponentProps<typeof Pressable, RadioItemState> & {
  value: unknown
  label?: string | undefined
  closeOnPress?: boolean | undefined
}

function RadioItem({
  value,
  label,
  closeOnPress = false,
  disabled: disabledProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RadioItemProps) {
  const { closeTree } = useMenuRootContext("Menu.RadioItem")
  const group = React.useContext(RadioGroupContext)
  if (!group) {
    throw new Error("Menu.RadioItem must be rendered inside Menu.RadioGroup")
  }
  const { setValue } = group
  const disabled = !!disabledProp || group.disabled
  const checked = Object.is(group.value, value)
  const highlight = useHighlight()

  const onPress = React.useCallback(
    (event: GestureResponderEvent) => {
      if (disabled) return
      setValue(value, event)
      if (closeOnPress) closeTree(REASONS.itemPress, event)
    },
    [disabled, setValue, value, closeOnPress, closeTree]
  )

  const state = React.useMemo<RadioItemState>(
    () => ({ checked, disabled, highlighted: highlight.highlighted }),
    [checked, disabled, highlight.highlighted]
  )

  const element = useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        role: "radio",
        accessibilityLabel: label,
        accessibilityState: { checked, disabled },
        disabled: disabled || undefined,
        onPress,
        ...highlight.props,
      },
      elementProps,
    ],
  })

  return (
    <RadioItemContext.Provider value={state}>
      {element}
    </RadioItemContext.Provider>
  )
}

RadioItem.displayName = "MenuRadioItem"

function RadioItemIndicator({
  keepMounted = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: IndicatorProps<RadioItemState>) {
  const item = React.useContext(RadioItemContext)
  if (!item) {
    throw new Error(
      "Menu.RadioItemIndicator must be rendered inside Menu.RadioItem"
    )
  }

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: item,
    ref,
    props: [HIDDEN_PROPS, elementProps],
    enabled: keepMounted || item.checked,
  })
}

RadioItemIndicator.displayName = "MenuRadioItemIndicator"

type GroupState = Record<never, never>

const EMPTY_STATE: GroupState = {}

interface GroupContextValue {
  setLabelId: (id: string | undefined) => void
}

const GroupContext = React.createContext<GroupContextValue | null>(null)

type GroupProps = BaseUIComponentProps<typeof View, GroupState>

function Group({ render, className, style, ref, ...elementProps }: GroupProps) {
  const [labelId, setLabelId] = React.useState<string | undefined>(undefined)
  const context = React.useMemo<GroupContextValue>(() => ({ setLabelId }), [])

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [{ role: "group", accessibilityLabelledBy: labelId }, elementProps],
  })

  return (
    <GroupContext.Provider value={context}>{element}</GroupContext.Provider>
  )
}

Group.displayName = "MenuGroup"

type GroupLabelProps = BaseUIComponentProps<typeof Text, GroupState>

function GroupLabel({
  nativeID: nativeIDProp,
  render,
  className,
  style,
  ref,
  ...elementProps
}: GroupLabelProps) {
  const generatedId = React.useId()
  const nativeID = nativeIDProp ?? generatedId
  const group = React.useContext(GroupContext)
  const setLabelId = group?.setLabelId

  React.useEffect(() => {
    if (!setLabelId) return
    setLabelId(nativeID)
    return () => setLabelId(undefined)
  }, [setLabelId, nativeID])

  return useRender({
    defaultComponent: Text,
    render,
    className,
    style,
    state: EMPTY_STATE,
    ref,
    props: [{ nativeID }, elementProps],
  })
}

GroupLabel.displayName = "MenuGroupLabel"

interface SeparatorState {
  orientation: Orientation
}

type SeparatorProps = BaseUIComponentProps<typeof View, SeparatorState> & {
  orientation?: Orientation | undefined
}

function Separator({
  orientation = "horizontal",
  render,
  className,
  style,
  ref,
  ...elementProps
}: SeparatorProps) {
  const state = React.useMemo<SeparatorState>(
    () => ({ orientation }),
    [orientation]
  )

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ role: "separator" }, elementProps],
  })
}

Separator.displayName = "MenuSeparator"

interface SubmenuTriggerState {
  open: boolean
  disabled: boolean
  highlighted: boolean
}

type SubmenuTriggerProps = BaseUIComponentProps<
  typeof Pressable,
  SubmenuTriggerState
> & {
  label?: string | undefined
}

function SubmenuTrigger({
  label,
  disabled,
  render,
  className,
  style,
  ref,
  ...elementProps
}: SubmenuTriggerProps) {
  const menu = useMenuRootContext("Menu.SubmenuTrigger")
  if (!menu.nested) {
    throw new Error(
      "Menu.SubmenuTrigger must be rendered inside Menu.SubmenuRoot"
    )
  }
  const trigger = useFloatingTrigger({
    root: menu.floating,
    ref,
    disabled: disabled ?? undefined,
    role: "menuitem",
  })
  const highlight = useHighlight()

  const state = React.useMemo<SubmenuTriggerState>(
    () => ({ ...trigger.state, highlighted: highlight.highlighted }),
    [trigger.state, highlight.highlighted]
  )

  return useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref: trigger.ref,
    props: [
      trigger.props,
      { accessibilityLabel: label, ...highlight.props },
      elementProps,
    ],
  })
}

SubmenuTrigger.displayName = "MenuSubmenuTrigger"

export type {
  ArrowProps,
  ArrowState,
  BackdropProps,
  BackdropState,
  CheckboxItemProps,
  CheckboxItemState,
  GroupLabelProps,
  GroupProps,
  GroupState,
  IndicatorProps,
  InternalRootProps,
  ItemProps,
  ItemState,
  MenuChangeEventDetails,
  MenuChangeEventReason,
  MenuParentType,
  MenuRootContextValue,
  PopupProps,
  PopupState,
  PortalProps,
  PositionerProps,
  RadioGroupProps,
  RadioGroupState,
  RadioItemProps,
  RadioItemState,
  RootProps,
  SeparatorProps,
  SeparatorState,
  SubmenuRootProps,
  SubmenuTriggerProps,
  SubmenuTriggerState,
  TriggerProps,
  TriggerState,
  ViewportProps,
  ViewportState,
}
export {
  Arrow,
  Backdrop,
  CheckboxItem,
  CheckboxItemIndicator,
  createHandle,
  Group,
  GroupLabel,
  Handle,
  Item,
  MenuRootContext,
  MenuRootImpl,
  Popup,
  Portal,
  Positioner,
  RadioGroup,
  RadioItem,
  RadioItemIndicator,
  Root,
  Separator,
  SubmenuRoot,
  SubmenuTrigger,
  Trigger,
  useMenuRootContext,
  Viewport,
}
