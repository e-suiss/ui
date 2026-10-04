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

function WheelPicker({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="wheel-picker"
      className={cn(
        "relative flex items-stretch justify-center [--wheel-picker-item-height:--spacing(9)] before:pointer-events-none before:absolute before:inset-x-0 before:top-1/2 before:h-(--wheel-picker-item-height) before:-translate-y-1/2 before:rounded-lg before:bg-control",
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

  const paint = React.useCallback(() => {
    const column = columnRef.current
    if (!column) return
    const center = column.scrollTop + column.clientHeight / 2
    for (const item of getItems()) {
      const distance =
        (item.offsetTop + item.offsetHeight / 2 - center) / item.offsetHeight
      item.style.setProperty("--wheel-picker-distance", distance.toFixed(3))
      item.style.setProperty(
        "--wheel-picker-distance-abs",
        Math.abs(distance).toFixed(3)
      )
    }
  }, [getItems])

  const handleScroll = React.useCallback(() => {
    cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(paint)
    clearTimeout(settleRef.current)
    settleRef.current = setTimeout(() => {
      const next = getItems()[getCenteredIndex()]?.dataset.value
      if (next !== undefined) select(next)
    }, 120)
  }, [paint, getItems, getCenteredIndex, select])

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

  React.useLayoutEffect(() => {
    scrollTo(Math.max(getIndex(valueRef.current), 0), "auto")
    paint()
  }, [scrollTo, getIndex, paint])

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
        onClickCapture={handleClick}
        onKeyDownCapture={handleKeyDown}
        className={cn(
          "no-scrollbar relative h-[calc(var(--wheel-picker-item-height)*5)] snap-y snap-mandatory overflow-y-auto overscroll-contain rounded-lg py-[calc(var(--wheel-picker-item-height)*2)] outline-none perspective-distant focus-visible:focus-ring",
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
      data-selected={selected}
      className={cn(
        "flex h-(--wheel-picker-item-height) cursor-default snap-center items-center justify-center px-3 text-lg whitespace-nowrap text-label tabular-nums opacity-[max(0.25,calc(1-var(--wheel-picker-distance-abs,0)*0.5))] select-none backface-hidden transform-[rotateX(calc(var(--wheel-picker-distance,0)*-20deg))]",
        className
      )}
      {...props}
    />
  )
}

export { WheelPicker, WheelPickerColumn, WheelPickerItem }
