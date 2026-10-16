import { cn } from "cn"
import { XIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Platform,
  Pressable,
  useWindowDimensions,
  View,
  type ViewProps,
} from "react-native"
import {
  Easing,
  FadeInDown,
  FadeOut,
  Keyframe,
  ReduceMotion,
} from "react-native-reanimated"
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens"
import * as PopoverPrimitive from "@/components/primitives/popover"
import type { Align, Side } from "@/components/primitives/types"
import { resolveClassName } from "@/components/primitives/use-render"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon, IconClassContext } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type TipStorage = {
  getItem: (key: string) => string | null | Promise<string | null>
  setItem: (key: string, value: string) => void | Promise<void>
}

type TipContextProps = {
  id: string
  titleId: string
  visible: boolean
  dismiss: () => void
  anchorRef: React.RefObject<React.ComponentRef<typeof View> | null>
}

type TipGroupContextProps = {
  current: string | null
  storage: TipStorage
  register: (id: string) => () => void
  resolve: (id: string, dismissed: boolean) => void
  complete: (id: string) => void
}

const TipContext = React.createContext<TipContextProps | null>(null)

const TipGroupContext = React.createContext<TipGroupContextProps | null>(null)

function useTip() {
  const context = React.useContext(TipContext)
  if (!context) {
    throw new Error("useTip must be used within a <Tip />")
  }
  return context
}

const STORAGE_PREFIX = "tip:"

const DISMISSED = "dismissed"

const memory = new Map<string, string>()

const memoryStorage: TipStorage = {
  getItem: (key) => memory.get(key) ?? null,
  setItem: (key, value) => {
    memory.set(key, value)
  },
}

async function resetTips(ids: string[], storage: TipStorage = memoryStorage) {
  try {
    await Promise.all(ids.map((id) => storage.setItem(STORAGE_PREFIX + id, "")))
    return true
  } catch {
    return false
  }
}

function TipGroup({
  storage = memoryStorage,
  children,
}: {
  storage?: TipStorage
  children?: React.ReactNode
}) {
  const [order, setOrder] = React.useState<string[]>([])
  const [resolved, setResolved] = React.useState<string[]>([])
  const [completed, setCompleted] = React.useState<string[]>([])

  let current: string | null = null
  for (const id of order) {
    if (completed.includes(id)) continue
    current = resolved.includes(id) ? id : null
    break
  }

  const register = React.useCallback((id: string) => {
    setOrder((ids) => (ids.includes(id) ? ids : [...ids, id]))
    return () => setOrder((ids) => ids.filter((entry) => entry !== id))
  }, [])

  const resolve = React.useCallback((id: string, dismissed: boolean) => {
    if (dismissed) setCompleted((ids) => [...ids, id])
    else setResolved((ids) => [...ids, id])
  }, [])

  const complete = React.useCallback((id: string) => {
    setCompleted((ids) => [...ids, id])
  }, [])

  const contextValue = React.useMemo(
    () => ({ current, storage, register, resolve, complete }),
    [current, storage, register, resolve, complete]
  )

  return (
    <TipGroupContext.Provider value={contextValue}>
      {children}
    </TipGroupContext.Provider>
  )
}

function Tip({
  id,
  delay = 0,
  onDismiss,
  children,
}: {
  id: string
  delay?: number
  onDismiss?: () => void
  children?: React.ReactNode
}) {
  const group = React.useContext(TipGroupContext)
  const storage = group?.storage ?? memoryStorage
  const [stored, setStored] = React.useState<boolean | null>(null)
  const [ready, setReady] = React.useState(false)
  const [dismissed, setDismissed] = React.useState(false)
  const anchorRef = React.useRef<React.ComponentRef<typeof View>>(null)
  const titleId = `${React.useId()}-title`
  const register = group?.register
  const resolve = group?.resolve
  const complete = group?.complete
  const turn = !group || group.current === id
  const visible = ready && turn && !dismissed && stored === false

  React.useEffect(() => register?.(id), [register, id])

  React.useEffect(() => {
    let cancelled = false
    Promise.resolve(storage.getItem(STORAGE_PREFIX + id))
      .catch(() => null)
      .then((value) => {
        if (cancelled) return
        const isDismissed = value === DISMISSED
        setStored(isDismissed)
        resolve?.(id, isDismissed)
      })
    return () => {
      cancelled = true
    }
  }, [storage, id, resolve])

  React.useEffect(() => {
    if (stored !== false || !turn) return
    const timer = setTimeout(() => setReady(true), delay)
    return () => clearTimeout(timer)
  }, [stored, turn, delay])

  const dismiss = React.useCallback(() => {
    setDismissed(true)
    Promise.resolve(storage.setItem(STORAGE_PREFIX + id, DISMISSED)).catch(
      () => undefined
    )
    complete?.(id)
    onDismiss?.()
  }, [storage, id, complete, onDismiss])

  const contextValue = React.useMemo(
    () => ({ id, titleId, visible, dismiss, anchorRef }),
    [id, titleId, visible, dismiss]
  )

  return (
    <TipContext.Provider value={contextValue}>{children}</TipContext.Provider>
  )
}

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

function TipCard({ className, ...props }: ViewProps) {
  const { visible } = useTip()
  if (!visible) return null
  return (
    <AnimatedView
      entering={FadeInDown.duration(400)
        .easing(EASING)
        .reduceMotion(ReduceMotion.System)}
      exiting={FadeOut.duration(300).reduceMotion(ReduceMotion.System)}
    >
      <View
        role="note"
        className={cn(
          "relative flex-row items-start gap-3 rounded-2xl bg-muted p-4 pe-12",
          className
        )}
        {...props}
      />
    </AnimatedView>
  )
}

function TipAnchor({
  className,
  onStartShouldSetResponderCapture,
  ...props
}: ViewProps) {
  const { anchorRef, visible, dismiss } = useTip()
  return (
    <View
      ref={anchorRef}
      collapsable={false}
      onStartShouldSetResponderCapture={(event) => {
        if (visible) dismiss()
        return onStartShouldSetResponderCapture?.(event) ?? false
      }}
      className={cn("flex-row self-start", className)}
      {...props}
    />
  )
}

const FullWindowOverlay =
  Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment

const ENTERING = new Keyframe({
  0: { opacity: 0, transform: [{ scale: 0.9 }] },
  100: { opacity: 1, transform: [{ scale: 1 }], easing: EASING },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

const EXITING = new Keyframe({
  0: { opacity: 1, transform: [{ scale: 1 }] },
  100: { opacity: 0, transform: [{ scale: 0.9 }], easing: EASING },
})
  .duration(300)
  .reduceMotion(ReduceMotion.System)

const ARROW_OFFSET: Record<Side, string> = {
  top: "-bottom-2",
  bottom: "-top-2",
  left: "-right-2",
  right: "-left-2",
}

function TipPopover({
  className,
  children,
  side = "bottom",
  align = "center",
  sideOffset = 10,
  portalHost,
  ...props
}: React.ComponentProps<typeof PopoverPrimitive.Popup> & {
  side?: Side
  align?: Align
  sideOffset?: number
  portalHost?: string
}) {
  const tip = useTip()
  const { visible, dismiss, anchorRef, titleId } = tip
  const { width } = useWindowDimensions()
  return (
    <PopoverPrimitive.Root
      open={visible}
      modal={false}
      onOpenChange={(open) => {
        if (!open) dismiss()
      }}
    >
      <PopoverPrimitive.Portal hostName={portalHost}>
        <FullWindowOverlay>
          <PopoverPrimitive.Positioner
            anchor={anchorRef}
            side={side}
            align={align}
            sideOffset={sideOffset}
            collisionPadding={16}
            className="z-50"
          >
            <PopoverPrimitive.Popup
              initialFocus={false}
              finalFocus={false}
              accessibilityLabelledBy={titleId}
              render={<AnimatedView entering={ENTERING} exiting={EXITING} />}
              className={(state) =>
                cn(
                  "relative flex-row items-start gap-3 rounded-2xl border border-foreground/5 bg-popover p-4 pe-12 shadow-lg dark:border-foreground/10",
                  resolveClassName(className, state)
                )
              }
              style={{ width: Math.min(320, width - 32) }}
              {...props}
            >
              <PopoverPrimitive.Arrow
                className={(state) => cn("size-4", ARROW_OFFSET[state.side])}
              >
                <View className="size-3 translate-x-0.5 translate-y-0.5 rotate-45 rounded-xs bg-popover" />
              </PopoverPrimitive.Arrow>
              <TipContext.Provider value={tip}>{children}</TipContext.Provider>
            </PopoverPrimitive.Popup>
          </PopoverPrimitive.Positioner>
        </FullWindowOverlay>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  )
}

function TipIcon({ className, ...props }: ViewProps) {
  return (
    <IconClassContext.Provider value="size-8 text-primary">
      <View
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
        className={cn("shrink-0 flex-row", className)}
        {...props}
      />
    </IconClassContext.Provider>
  )
}

function TipContent({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function TipTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  const { titleId } = useTip()
  return (
    <Text
      nativeID={titleId}
      className={cn("text-base font-semibold", className)}
      {...props}
    />
  )
}

function TipDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  )
}

function TipClose({
  className,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children">) {
  const { dismiss } = useTip()
  return (
    <Pressable
      role="button"
      accessibilityLabel="Dismiss tip"
      hitSlop={6}
      onPress={(event) => {
        onPress?.(event)
        dismiss()
      }}
      className={cn(
        "absolute end-2 top-2 size-8 items-center justify-center rounded-full active:opacity-80",
        className
      )}
      {...props}
    >
      <Icon as={XIcon} weight="bold" className="size-4 text-muted-foreground" />
    </Pressable>
  )
}

export type { TipStorage }
export {
  resetTips,
  Tip,
  TipAnchor,
  TipCard,
  TipClose,
  TipContent,
  TipDescription,
  TipGroup,
  TipIcon,
  TipPopover,
  TipTitle,
  useTip,
}
