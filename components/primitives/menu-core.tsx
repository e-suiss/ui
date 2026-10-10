import * as React from "react"
import {
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type LayoutRectangle,
  Pressable,
  type Role,
  Text,
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
import { Slot } from "./slot"
import type {
  ForceMountable,
  PositionedContentProps,
  PressableRef,
  SlottablePressableProps,
  SlottableTextProps,
  SlottableViewProps,
  TextRef,
  TriggerRef,
  ViewRef,
} from "./types"

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

interface AnchoredLayout {
  triggerPosition: LayoutPosition | null
  contentLayout: LayoutRectangle | null
  setContentLayout: (layout: LayoutRectangle | null) => void
}

function useAnchoredLayout(
  open: boolean,
  triggerRef: React.RefObject<PressableRef | null>,
  anchorRef?: React.RefObject<LayoutPosition | null>
): AnchoredLayout {
  const { width, height } = useWindowDimensions()
  const [triggerPosition, setTriggerPosition] =
    React.useState<LayoutPosition | null>(null)
  const [contentLayout, setContentLayoutState] =
    React.useState<LayoutRectangle | null>(null)

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
    if (width <= 0 || height <= 0) return
    const anchor = anchorRef?.current
    if (anchor) {
      setTriggerPosition(anchor)
      return
    }
    measureLayoutPosition(triggerRef.current, setTriggerPosition)
  }, [open, width, height, triggerRef, anchorRef])

  return { triggerPosition, contentLayout, setContentLayout }
}

interface FloatingState extends AnchoredLayout {
  open: boolean
  close: () => void
}

interface FloatingRootOptions {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

interface FloatingRoot extends FloatingState {
  nativeID: string
  onOpenChange: (open: boolean) => void
  openAt: (position: LayoutPosition) => void
  triggerRef: React.RefObject<PressableRef | null>
}

function useFloatingRoot({
  open: openProp,
  defaultOpen,
  onOpenChange: onOpenChangeProp,
}: FloatingRootOptions): FloatingRoot {
  const nativeID = React.useId()
  const triggerRef = React.useRef<PressableRef>(null)
  const anchorRef = React.useRef<LayoutPosition | null>(null)
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  })
  const layout = useAnchoredLayout(open, triggerRef, anchorRef)

  const onOpenChange = React.useCallback(
    (value: boolean) => {
      if (!value) anchorRef.current = null
      setOpen(value)
    },
    [setOpen]
  )

  const openAt = React.useCallback(
    (position: LayoutPosition) => {
      anchorRef.current = position
      setOpen(true)
    },
    [setOpen]
  )

  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])

  return React.useMemo(
    () => ({
      ...layout,
      nativeID,
      open,
      onOpenChange,
      openAt,
      close,
      triggerRef,
    }),
    [layout, nativeID, open, onOpenChange, openAt, close]
  )
}

function useTriggerRef(
  ref: React.Ref<TriggerRef> | undefined,
  root: Pick<FloatingRoot, "open" | "onOpenChange" | "triggerRef">
) {
  const { onOpenChange } = root
  const augmentedRef = useAugmentedRef<TriggerRef>({
    ref,
    methods: {
      open: () => onOpenChange(true),
      close: () => onOpenChange(false),
    },
  })
  const composedRef = useComposedRefs<TriggerRef>(augmentedRef, root.triggerRef)
  useRestoreAccessibilityFocus(root.open, augmentedRef)
  return composedRef
}

const MenuCloseContext = React.createContext<(() => void) | null>(null)

function useMenuClose() {
  const close = React.useContext(MenuCloseContext)
  if (!close) {
    throw new Error(
      "Menu item components cannot be rendered outside a menu Content component"
    )
  }
  return close
}

type FloatingContentProps = SlottableViewProps & PositionedContentProps

type FloatingContentComponentProps = FloatingContentProps &
  React.RefAttributes<ViewRef> & {
    state: FloatingState
    role: Role
  }

function FloatingContent({
  state,
  role,
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
  onAccessibilityEscape: onAccessibilityEscapeProp,
  ref,
  ...props
}: FloatingContentComponentProps) {
  const { open, close, triggerPosition, contentLayout, setContentLayout } =
    state
  const focusRef = useAccessibilityFocus<ViewRef>(
    open && triggerPosition !== null
  )
  const composedRef = useComposedRefs<ViewRef>(ref, focusRef)
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

  function onAccessibilityEscape() {
    close()
    onAccessibilityEscapeProp?.()
  }

  if (!forceMount && !open) return null

  const Component = asChild ? Slot : View
  return (
    <MenuCloseContext.Provider value={close}>
      <Component
        ref={composedRef}
        role={role}
        aria-modal={true}
        accessibilityViewIsModal={true}
        onAccessibilityEscape={onAccessibilityEscape}
        onStartShouldSetResponder={claimResponder}
        style={[positionStyle, style]}
        onLayout={onLayout}
        {...props}
      />
    </MenuCloseContext.Provider>
  )
}

FloatingContent.displayName = "FloatingContent"

type OverlayProps = ForceMountable &
  SlottablePressableProps & {
    closeOnPress?: boolean
  }

type OverlayRef = PressableRef

function FloatingOverlay({
  open,
  close,
  asChild,
  forceMount,
  closeOnPress = true,
  onPress: onPressProp,
  ref,
  ...props
}: OverlayProps &
  React.RefAttributes<OverlayRef> & { open: boolean; close: () => void }) {
  function onPress(event: GestureResponderEvent) {
    if (closeOnPress) close()
    onPressProp?.(event)
  }

  if (!forceMount && !open) return null

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return <Component ref={ref} accessible={false} onPress={onPress} {...props} />
}

FloatingOverlay.displayName = "FloatingOverlay"

interface IndicatorContextValue {
  checked: boolean
}

const IndicatorContext = React.createContext<IndicatorContextValue | null>(null)

interface RadioGroupContextValue {
  value: string | undefined
  onValueChange?: (value: string) => void
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | null>(
  null
)

type ItemProps = SlottablePressableProps & {
  textValue?: string
  closeOnPress?: boolean
}

type CheckboxItemProps = SlottablePressableProps & {
  checked: boolean
  onCheckedChange?: (checked: boolean) => void
  textValue?: string
  closeOnPress?: boolean
}

type RadioGroupProps = SlottableViewProps & {
  value: string | undefined
  onValueChange?: (value: string) => void
}

type RadioItemProps = SlottablePressableProps & {
  value: string
  textValue?: string
  closeOnPress?: boolean
}

type ItemIndicatorProps = SlottableViewProps & ForceMountable
type GroupProps = SlottableViewProps
type LabelProps = SlottableTextProps
type SeparatorProps = SlottableViewProps & {
  decorative?: boolean
}

type SubProps = SlottableViewProps & {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
}

type SubTriggerProps = SlottablePressableProps & {
  textValue?: string
}

type SubContentProps = SlottablePressableProps & ForceMountable
type ViewSubContentProps = SlottableViewProps & ForceMountable

type ItemRef = PressableRef
type CheckboxItemRef = PressableRef
type RadioGroupRef = ViewRef
type RadioItemRef = PressableRef
type ItemIndicatorRef = ViewRef
type GroupRef = ViewRef
type LabelRef = TextRef
type SeparatorRef = ViewRef
type SubRef = ViewRef
type SubTriggerRef = PressableRef
type SubContentRef = PressableRef
type ViewSubContentRef = ViewRef

function Item({
  asChild,
  textValue,
  closeOnPress = true,
  disabled,
  onPress: onPressProp,
  ref,
  ...props
}: ItemProps & React.RefAttributes<ItemRef>) {
  const close = useMenuClose()

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onPressProp?.(event)
    if (closeOnPress) close()
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={ref}
      role="menuitem"
      aria-label={textValue}
      aria-disabled={!!disabled}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

Item.displayName = "MenuItem"

function CheckboxItem({
  asChild,
  checked,
  onCheckedChange,
  textValue,
  closeOnPress = true,
  disabled,
  onPress: onPressProp,
  ref,
  ...props
}: CheckboxItemProps & React.RefAttributes<CheckboxItemRef>) {
  const close = useMenuClose()
  const indicator = React.useMemo(() => ({ checked }), [checked])

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onCheckedChange?.(!checked)
    onPressProp?.(event)
    if (closeOnPress) close()
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <IndicatorContext.Provider value={indicator}>
      <Component
        ref={ref}
        role="checkbox"
        aria-label={textValue}
        aria-checked={checked}
        aria-disabled={!!disabled}
        disabled={disabled}
        onPress={onPress}
        {...props}
      />
    </IndicatorContext.Provider>
  )
}

CheckboxItem.displayName = "MenuCheckboxItem"

function RadioGroup({
  asChild,
  value,
  onValueChange,
  ref,
  ...props
}: RadioGroupProps & React.RefAttributes<RadioGroupRef>) {
  const context = React.useMemo(
    () => ({ value, onValueChange }),
    [value, onValueChange]
  )
  const Component = asChild ? Slot : View
  return (
    <RadioGroupContext.Provider value={context}>
      <Component ref={ref} role="radiogroup" {...props} />
    </RadioGroupContext.Provider>
  )
}

RadioGroup.displayName = "MenuRadioGroup"

function RadioItem({
  asChild,
  value: itemValue,
  textValue,
  closeOnPress = true,
  disabled,
  onPress: onPressProp,
  ref,
  ...props
}: RadioItemProps & React.RefAttributes<RadioItemRef>) {
  const close = useMenuClose()
  const group = React.useContext(RadioGroupContext)
  const checked = group?.value === itemValue
  const indicator = React.useMemo(() => ({ checked }), [checked])
  if (!group) {
    throw new Error(
      "Menu RadioItem cannot be rendered outside a RadioGroup component"
    )
  }
  const onValueChange = group.onValueChange

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onValueChange?.(itemValue)
    onPressProp?.(event)
    if (closeOnPress) close()
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <IndicatorContext.Provider value={indicator}>
      <Component
        ref={ref}
        role="radio"
        aria-label={textValue}
        aria-checked={checked}
        aria-disabled={!!disabled}
        disabled={disabled}
        onPress={onPress}
        {...props}
      />
    </IndicatorContext.Provider>
  )
}

RadioItem.displayName = "MenuRadioItem"

function ItemIndicator({
  asChild,
  forceMount,
  ref,
  ...props
}: ItemIndicatorProps & React.RefAttributes<ItemIndicatorRef>) {
  const indicator = React.useContext(IndicatorContext)
  if (!indicator) {
    throw new Error(
      "Menu ItemIndicator must be rendered inside a CheckboxItem or RadioItem"
    )
  }
  if (!forceMount && !indicator.checked) return null
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role="presentation"
      aria-hidden={true}
      importantForAccessibility="no-hide-descendants"
      {...props}
    />
  )
}

ItemIndicator.displayName = "MenuItemIndicator"

function Group({
  asChild,
  ref,
  ...props
}: GroupProps & React.RefAttributes<GroupRef>) {
  const Component = asChild ? Slot : View
  return <Component ref={ref} role="group" {...props} />
}

Group.displayName = "MenuGroup"

function Label({
  asChild,
  ref,
  ...props
}: LabelProps & React.RefAttributes<LabelRef>) {
  const Component = asChild ? Slot : Text
  return <Component ref={ref} {...props} />
}

Label.displayName = "MenuLabel"

function Separator({
  asChild,
  decorative,
  ref,
  ...props
}: SeparatorProps & React.RefAttributes<SeparatorRef>) {
  const Component = asChild ? Slot : View
  return (
    <Component
      ref={ref}
      role={decorative ? "presentation" : "separator"}
      aria-hidden={decorative === true}
      importantForAccessibility={decorative ? "no-hide-descendants" : "auto"}
      {...props}
    />
  )
}

Separator.displayName = "MenuSeparator"

interface SubContextValue {
  open: boolean
  onOpenChange: (open: boolean) => void
  nativeID: string
}

const SubContext = React.createContext<SubContextValue | null>(null)

function useSubContext() {
  const context = React.useContext(SubContext)
  if (!context) {
    throw new Error(
      "Sub compound components cannot be rendered outside of a Sub component"
    )
  }
  return context
}

function Sub({
  asChild,
  open: openProp,
  defaultOpen,
  onOpenChange: onOpenChangeProp,
  ref,
  ...props
}: SubProps & React.RefAttributes<SubRef>) {
  const nativeID = React.useId()
  const [open = false, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChangeProp,
  })
  const onOpenChange = React.useCallback(
    (value: boolean) => setOpen(value),
    [setOpen]
  )
  const context = React.useMemo(
    () => ({ open, onOpenChange, nativeID }),
    [open, onOpenChange, nativeID]
  )
  const Component = asChild ? Slot : View
  return (
    <SubContext.Provider value={context}>
      <Component ref={ref} {...props} />
    </SubContext.Provider>
  )
}

Sub.displayName = "MenuSub"

function SubTrigger({
  asChild,
  textValue,
  disabled,
  onPress: onPressProp,
  ref,
  ...props
}: SubTriggerProps & React.RefAttributes<SubTriggerRef>) {
  const { open, onOpenChange } = useSubContext()
  const triggerRef = React.useRef<SubTriggerRef>(null)
  const composedRef = useComposedRefs<SubTriggerRef>(ref, triggerRef)
  useRestoreAccessibilityFocus(open, triggerRef)

  function onPress(event: GestureResponderEvent) {
    if (disabled) return
    onOpenChange(!open)
    onPressProp?.(event)
  }

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={composedRef}
      role="menuitem"
      aria-label={textValue}
      aria-expanded={open}
      aria-disabled={!!disabled}
      disabled={disabled}
      onPress={onPress}
      {...props}
    />
  )
}

SubTrigger.displayName = "MenuSubTrigger"

function useSubContentBehavior<T extends ViewRef>(
  ref: React.Ref<T> | undefined,
  onAccessibilityEscapeProp: (() => void) | undefined
) {
  const { open, onOpenChange } = useSubContext()
  const focusRef = useAccessibilityFocus<T>(open)
  const composedRef = useComposedRefs<T>(ref, focusRef)
  const close = React.useCallback(() => onOpenChange(false), [onOpenChange])
  useBackHandler(open, close)

  function onAccessibilityEscape() {
    close()
    onAccessibilityEscapeProp?.()
  }

  return { open, composedRef, onAccessibilityEscape }
}

function SubContent({
  asChild,
  forceMount,
  onAccessibilityEscape: onAccessibilityEscapeProp,
  ref,
  ...props
}: SubContentProps & React.RefAttributes<SubContentRef>) {
  const { open, composedRef, onAccessibilityEscape } = useSubContentBehavior(
    ref,
    onAccessibilityEscapeProp
  )

  if (!forceMount && !open) return null

  const Component = (asChild ? Slot : Pressable) as typeof Pressable
  return (
    <Component
      ref={composedRef}
      role="menu"
      accessible={false}
      onAccessibilityEscape={onAccessibilityEscape}
      {...props}
    />
  )
}

SubContent.displayName = "MenuSubContent"

function ViewSubContent({
  asChild,
  forceMount,
  onAccessibilityEscape: onAccessibilityEscapeProp,
  ref,
  ...props
}: ViewSubContentProps & React.RefAttributes<ViewSubContentRef>) {
  const { open, composedRef, onAccessibilityEscape } = useSubContentBehavior(
    ref,
    onAccessibilityEscapeProp
  )

  if (!forceMount && !open) return null

  const Component = asChild ? Slot : View
  return (
    <Component
      ref={composedRef}
      role="menu"
      onAccessibilityEscape={onAccessibilityEscape}
      {...props}
    />
  )
}

ViewSubContent.displayName = "MenuSubContent"

export type {
  AnchoredLayout,
  CheckboxItemProps,
  CheckboxItemRef,
  FloatingContentProps,
  FloatingRoot,
  FloatingRootOptions,
  FloatingState,
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
  SubContentProps,
  SubContentRef,
  SubContextValue,
  SubProps,
  SubRef,
  SubTriggerProps,
  SubTriggerRef,
  ViewSubContentProps,
  ViewSubContentRef,
}
export {
  CheckboxItem,
  FloatingContent,
  FloatingOverlay,
  Group,
  Item,
  ItemIndicator,
  Label,
  RadioGroup,
  RadioItem,
  Separator,
  Sub,
  SubContent,
  SubTrigger,
  useAnchoredLayout,
  useFloatingRoot,
  useMenuClose,
  useSubContext,
  useTriggerRef,
  ViewSubContent,
}
