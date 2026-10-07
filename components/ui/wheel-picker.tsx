"use client"

import { cn } from "cn"
import * as React from "react"

type WheelPickerColumnProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
}

type WheelPickerColumnContextProps = {
  value: string | undefined
  select: (value: string) => void
  getItemId: (value: string) => string
}

const WheelPickerColumnContext =
  React.createContext<WheelPickerColumnContextProps | null>(null)

function useWheelPickerColumn() {
  const context = React.useContext(WheelPickerColumnContext)

  if (!context) {
    throw new Error(
      "useWheelPickerColumn must be used within a <WheelPickerColumn />"
    )
  }

  return context
}

declare const ViewTimeline: {
  new (options: {
    subject: Element
    axis: "block"
    inset: CSSNumericValue[]
  }): AnimationTimeline
}

const ROW_ANGLE = Math.PI / 10.5
const MAX_ANGLE = Math.PI / 2
const PERSPECTIVE = 1200
const FADE_ANGLE = 0.35
const VISIBLE_ROWS = MAX_ANGLE / ROW_ANGLE
const CURVE_STEPS = 42
const ANIMATED_BUFFER = 3
const SUPPORTS_SCROLL_END =
  typeof window !== "undefined" && "onscrollend" in window
const SUPPORTS_VIEW_TIMELINE =
  typeof window !== "undefined" && "ViewTimeline" in window

function curve(distance: number, height: number) {
  const radius = height / ROW_ANGLE
  const angle = Math.min(Math.max(distance * ROW_ANGLE, -MAX_ANGLE), MAX_ANGLE)
  const offset = Math.abs(distance)
  const tone = offset < 1 ? 1 - offset * 0.45 : 0.55 - (offset - 1) * 0.06
  const fade = Math.min(1, (MAX_ANGLE - Math.abs(angle)) / FADE_ANGLE)
  const depth = PERSPECTIVE / (PERSPECTIVE + radius - radius * Math.cos(angle))
  const y = radius * Math.sin(angle) - distance * height
  return {
    transform: `translateY(${y.toFixed(2)}px) scale(${depth.toFixed(3)}, ${(depth * Math.cos(angle)).toFixed(3)})`,
    opacity: Math.max(0, tone * fade).toFixed(3),
  }
}

function curveKeyframes(height: number) {
  return Array.from({ length: CURVE_STEPS + 1 }, (_, step) =>
    curve(VISIBLE_ROWS * (1 - (2 * step) / CURVE_STEPS), height)
  )
}

function isEnabled(item: HTMLElement | undefined) {
  return item !== undefined && !item.hasAttribute("data-disabled")
}

function enabledIndex(items: HTMLElement[], from: number, step: 1 | -1) {
  for (let index = from; index >= 0 && index < items.length; index += step) {
    if (isEnabled(items[index])) return index
  }
  return -1
}

function nearestEnabledIndex(items: HTMLElement[], from: number) {
  for (let distance = 0; distance < items.length; distance++) {
    if (isEnabled(items[from - distance])) return from - distance
    if (isEnabled(items[from + distance])) return from + distance
  }
  return -1
}

function scrollBehavior(): ScrollBehavior {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "auto"
    : "smooth"
}

function WheelPicker({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="wheel-picker"
      className={cn(
        "relative flex items-stretch justify-center [--wheel-picker-item-height:--spacing(8)] before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:h-(--wheel-picker-item-height) before:-translate-y-1/2 before:rounded-lg before:bg-control",
        className
      )}
      {...props}
    />
  )
}

function WheelPickerColumn({
  value: valueProp,
  defaultValue,
  onValueChange,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & WheelPickerColumnProps) {
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const value = valueProp ?? uncontrolledValue
  const valueRef = React.useRef(value)
  valueRef.current = value

  const columnRef = React.useRef<HTMLDivElement>(null)
  const frameRef = React.useRef(0)
  const settleRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)
  const id = React.useId()

  const getItems = React.useCallback(
    () =>
      Array.from(
        columnRef.current?.querySelectorAll<HTMLElement>(
          "[data-slot=wheel-picker-item]"
        ) ?? []
      ),
    []
  )

  const getIndex = React.useCallback(
    (target: string | undefined) =>
      getItems().findIndex((item) => item.dataset.value === target),
    [getItems]
  )

  const getCenteredIndex = React.useCallback(() => {
    const column = columnRef.current
    const items = getItems()
    const first = items[0]
    if (!column || !first) return -1
    const index = Math.round(column.scrollTop / first.offsetHeight)
    return Math.min(Math.max(index, 0), items.length - 1)
  }, [getItems])

  const getItemId = React.useCallback(
    (itemValue: string) => `${id}-${itemValue.replace(/\s+/g, "-")}`,
    [id]
  )

  const select = React.useCallback(
    (next: string) => {
      if (next === valueRef.current) return
      valueRef.current = next
      if (valueProp === undefined) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [valueProp, onValueChange]
  )

  const targetRef = React.useRef<number | null>(null)

  const scrollTo = React.useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const column = columnRef.current
      const item = getItems()[index]
      if (!column || !item) return
      const top = index * item.offsetHeight
      targetRef.current =
        behavior === "smooth" && Math.abs(column.scrollTop - top) >= 1
          ? index
          : null
      column.scrollTo({ top, behavior })
    },
    [getItems]
  )

  const releaseTarget = React.useCallback(() => {
    targetRef.current = null
  }, [])

  const paintedRef = React.useRef<HTMLElement[]>([])
  const updateRef = React.useRef<() => void>(() => undefined)

  const paint = React.useCallback(() => {
    const column = columnRef.current
    const items = getItems()
    const firstItem = items[0]
    if (!column || !firstItem) return
    const height = firstItem.offsetHeight
    const position = column.scrollTop / height
    const first = Math.max(Math.ceil(position - VISIBLE_ROWS), 0)
    const last = Math.min(Math.floor(position + VISIBLE_ROWS), items.length - 1)
    const painted: HTMLElement[] = []
    for (let index = first; index <= last; index++) {
      const item = items[index]
      if (!item) continue
      const content = item.firstElementChild as HTMLElement | null
      if (!content) continue
      const { transform, opacity } = curve(index - position, height)
      content.style.transform = transform
      content.style.opacity = opacity
      painted.push(content)
    }
    for (const content of paintedRef.current) {
      if (painted.includes(content)) continue
      content.style.transform = ""
      content.style.opacity = ""
    }
    paintedRef.current = painted
  }, [getItems])

  const settle = React.useCallback(() => {
    const items = getItems()
    const centered = getCenteredIndex()
    if (targetRef.current !== null) {
      if (centered !== targetRef.current) return
      targetRef.current = null
    }
    const index = nearestEnabledIndex(items, centered)
    const next = items[index]?.dataset.value
    if (next === undefined) return
    if (index !== centered) scrollTo(index, scrollBehavior())
    select(next)
  }, [getItems, getCenteredIndex, scrollTo, select])

  const handleScroll = React.useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(() => updateRef.current())
    if (SUPPORTS_SCROLL_END) return
    clearTimeout(settleRef.current)
    settleRef.current = setTimeout(settle, 150)
  }, [settle])

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      const item = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-slot=wheel-picker-item]"
      )
      if (item?.dataset.value === undefined || !isEnabled(item)) return
      select(item.dataset.value)
    },
    [select]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const items = getItems()
      const current = Math.max(getIndex(valueRef.current), 0)
      const last = items.length - 1
      let target: number

      if (event.key === "ArrowDown") {
        target = enabledIndex(items, current + 1, 1)
      } else if (event.key === "ArrowUp") {
        target = enabledIndex(items, current - 1, -1)
      } else if (event.key === "PageDown") {
        target = nearestEnabledIndex(items, Math.min(current + 5, last))
      } else if (event.key === "PageUp") {
        target = nearestEnabledIndex(items, Math.max(current - 5, 0))
      } else if (event.key === "Home") {
        target = enabledIndex(items, 0, 1)
      } else if (event.key === "End") {
        target = enabledIndex(items, last, -1)
      } else {
        return
      }

      event.preventDefault()
      const next = items[target]?.dataset.value
      if (next !== undefined) select(next)
    },
    [getItems, getIndex, select]
  )

  const itemCount = React.Children.count(children)

  React.useLayoutEffect(() => {
    scrollTo(Math.max(getIndex(valueRef.current), 0), "auto")
  }, [scrollTo, getIndex])

  React.useLayoutEffect(() => {
    const column = columnRef.current
    if (!column || itemCount === 0) return
    if (!SUPPORTS_VIEW_TIMELINE) {
      paintedRef.current = []
      updateRef.current = paint
      paint()
      return
    }
    const animations = new Map<HTMLElement, Animation>()
    let keyframes: Keyframe[] = []
    let inset: CSSNumericValue[] = []
    let height = 0
    let range = ""
    const update = () => {
      if (!height) return
      const position = Math.round(column.scrollTop / height)
      const first = Math.floor(position - VISIBLE_ROWS - ANIMATED_BUFFER)
      const last = Math.ceil(position + VISIBLE_ROWS + ANIMATED_BUFFER)
      if (range === `${first}:${last}`) return
      range = `${first}:${last}`
      const items = getItems()
      for (const [content, animation] of animations) {
        const index = items.indexOf(content.parentElement as HTMLElement)
        if (index >= first && index <= last) continue
        animation.cancel()
        animations.delete(content)
      }
      for (
        let index = Math.max(first, 0);
        index <= Math.min(last, items.length - 1);
        index++
      ) {
        const item = items[index]
        if (!item) continue
        const content = item.firstElementChild as HTMLElement | null
        if (!content || animations.has(content)) continue
        animations.set(
          content,
          content.animate(keyframes, {
            timeline: new ViewTimeline({ subject: item, axis: "block", inset }),
            fill: "both",
          })
        )
      }
    }
    const rebuild = () => {
      height = getItems()[0]?.offsetHeight ?? 0
      range = ""
      if (!height) return
      keyframes = curveKeyframes(height)
      const reach = (VISIBLE_ROWS - 0.5) * height - column.clientHeight / 2
      inset = [CSS.px(-reach), CSS.px(-reach)]
      for (const animation of animations.values()) animation.cancel()
      animations.clear()
      update()
    }
    updateRef.current = update
    const observer = new ResizeObserver(rebuild)
    observer.observe(column)
    rebuild()
    return () => {
      observer.disconnect()
      for (const animation of animations.values()) animation.cancel()
    }
  }, [itemCount, getItems, paint])

  React.useEffect(() => {
    const index = getIndex(value)
    if (index === -1 || index === getCenteredIndex()) return
    scrollTo(index, scrollBehavior())
  }, [value, getIndex, getCenteredIndex, scrollTo])

  React.useEffect(
    () => () => {
      cancelAnimationFrame(frameRef.current)
      clearTimeout(settleRef.current)
    },
    []
  )

  return (
    <WheelPickerColumnContext.Provider value={{ value, select, getItemId }}>
      <div
        ref={columnRef}
        data-slot="wheel-picker-column"
        role="listbox"
        tabIndex={0}
        aria-activedescendant={
          value === undefined ? undefined : getItemId(value)
        }
        onScroll={handleScroll}
        onScrollEnd={settle}
        onWheel={releaseTarget}
        onTouchStart={releaseTarget}
        onPointerDown={releaseTarget}
        onClickCapture={handleClick}
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "no-scrollbar relative h-[calc(var(--wheel-picker-item-height)*6.75)] snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-lg py-[calc(var(--wheel-picker-item-height)*2.875)] outline-none focus-visible:focus-ring",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </WheelPickerColumnContext.Provider>
  )
}

function WheelPickerItem({
  value,
  disabled = false,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string; disabled?: boolean }) {
  const { value: selectedValue, getItemId } = useWheelPickerColumn()
  const selected = selectedValue === value

  return (
    <div
      id={getItemId(value)}
      role="option"
      tabIndex={-1}
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      data-slot="wheel-picker-item"
      data-value={value}
      data-selected={selected ? "" : undefined}
      data-disabled={disabled ? "" : undefined}
      className={cn(
        "flex h-(--wheel-picker-item-height) cursor-default snap-center items-center justify-center px-3 text-xl whitespace-nowrap text-label tabular-nums select-none data-disabled:text-label-tertiary",
        className
      )}
      {...props}
    >
      <span className="opacity-0">{children}</span>
    </div>
  )
}

export { WheelPicker, WheelPickerColumn, WheelPickerItem }
