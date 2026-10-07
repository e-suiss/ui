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
    if (!column || items.length === 0) return -1
    const index = Math.round(column.scrollTop / items[0].offsetHeight)
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

  const scrollTo = React.useCallback(
    (index: number, behavior: ScrollBehavior) => {
      const item = getItems()[index]
      if (!item) return
      columnRef.current?.scrollTo({ top: index * item.offsetHeight, behavior })
    },
    [getItems]
  )

  const paintedRef = React.useRef<HTMLElement[]>([])
  const updateRef = React.useRef<() => void>(() => undefined)

  const paint = React.useCallback(() => {
    const column = columnRef.current
    const items = getItems()
    if (!column || items.length === 0) return
    const height = items[0].offsetHeight
    const position = column.scrollTop / height
    const first = Math.max(Math.ceil(position - VISIBLE_ROWS), 0)
    const last = Math.min(Math.floor(position + VISIBLE_ROWS), items.length - 1)
    const painted: HTMLElement[] = []
    for (let index = first; index <= last; index++) {
      const content = items[index].firstElementChild as HTMLElement | null
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
    const next = getItems()[getCenteredIndex()]?.dataset.value
    if (next !== undefined) select(next)
  }, [getItems, getCenteredIndex, select])

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
      if (item?.dataset.value !== undefined) select(item.dataset.value)
    },
    [select]
  )

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const items = getItems()
      const current = Math.max(getIndex(valueRef.current), 0)
      let target: number

      if (event.key === "ArrowDown") {
        target = current + 1
      } else if (event.key === "ArrowUp") {
        target = current - 1
      } else if (event.key === "PageDown") {
        target = current + 5
      } else if (event.key === "PageUp") {
        target = current - 5
      } else if (event.key === "Home") {
        target = 0
      } else if (event.key === "End") {
        target = items.length - 1
      } else {
        return
      }

      event.preventDefault()
      const next =
        items[Math.min(Math.max(target, 0), items.length - 1)]?.dataset.value
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
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    scrollTo(index, reducedMotion ? "auto" : "smooth")
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
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { value: selectedValue, getItemId } = useWheelPickerColumn()
  const selected = selectedValue === value

  return (
    <div
      id={getItemId(value)}
      role="option"
      tabIndex={-1}
      aria-selected={selected}
      data-slot="wheel-picker-item"
      data-value={value}
      data-selected={selected ? "" : undefined}
      className={cn(
        "flex h-(--wheel-picker-item-height) cursor-default snap-center items-center justify-center px-3 text-xl whitespace-nowrap text-label tabular-nums select-none",
        className
      )}
      {...props}
    >
      <span className="opacity-0">{children}</span>
    </div>
  )
}

export { WheelPicker, WheelPickerColumn, WheelPickerItem }
