"use client"

import { MagnifyingGlassIcon, XCircleIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

const SETTLE_DELAY = 140

function fieldOf(root: HTMLElement | null) {
  return root?.querySelector<HTMLElement>("[data-slot=search-reveal-field]")
}

function SearchReveal({ className, ...props }: React.ComponentProps<"div">) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useLayoutEffect(() => {
    const root = ref.current
    const field = fieldOf(root)
    if (!root || !field) return
    const height = () => field.offsetHeight
    const hasQuery = () =>
      Boolean(field.querySelector<HTMLInputElement>("input")?.value)
    let touching = false
    let timer = 0
    let frame = 0

    const update = () => {
      frame = 0
      const reveal = Math.min(Math.max(1 - root.scrollTop / height(), 0), 1)
      root.style.setProperty("--search-reveal", String(reveal))
    }

    const settle = () => {
      const top = root.scrollTop
      const size = height()
      if (touching || top <= 0 || top >= size) return
      root.scrollTo({
        top: top < size / 2 || hasQuery() ? 0 : size,
        behavior: "smooth",
      })
    }

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, SETTLE_DELAY)
    }
    const onTouchStart = () => {
      touching = true
    }
    const onTouchEnd = () => {
      touching = false
      window.clearTimeout(timer)
      timer = window.setTimeout(settle, SETTLE_DELAY)
    }

    root.scrollTop = hasQuery() ? 0 : height()
    update()
    root.addEventListener("scroll", onScroll, { passive: true })
    root.addEventListener("touchstart", onTouchStart, { passive: true })
    root.addEventListener("touchend", onTouchEnd)
    root.addEventListener("touchcancel", onTouchEnd)
    return () => {
      window.clearTimeout(timer)
      cancelAnimationFrame(frame)
      root.removeEventListener("scroll", onScroll)
      root.removeEventListener("touchstart", onTouchStart)
      root.removeEventListener("touchend", onTouchEnd)
      root.removeEventListener("touchcancel", onTouchEnd)
    }
  }, [])

  return (
    <div
      ref={ref}
      data-slot="search-reveal"
      className={cn(
        "overflow-y-auto overscroll-y-contain [--search-reveal:0]",
        className
      )}
      {...props}
    />
  )
}

function SearchRevealField({
  value,
  onValueChange,
  placeholder = "Search",
  className,
  onFocus,
  ...props
}: Omit<React.ComponentProps<"input">, "value" | "type"> & {
  value: string
  onValueChange: (value: string) => void
}) {
  const inputRef = React.useRef<HTMLInputElement>(null)

  return (
    <div
      data-slot="search-reveal-field"
      className="px-4 pb-2 opacity-(--search-reveal)"
    >
      <div className="flex h-9 items-center gap-1.5 rounded-lg bg-control px-2 text-label-secondary focus-within:focus-ring">
        <MagnifyingGlassIcon aria-hidden className="size-4.5 shrink-0" />
        <input
          ref={inputRef}
          type="search"
          data-slot="search-reveal-input"
          value={value}
          placeholder={placeholder}
          aria-label={placeholder}
          onChange={(event) => onValueChange(event.target.value)}
          onFocus={(event) => {
            event.currentTarget
              .closest("[data-slot=search-reveal]")
              ?.scrollTo({ top: 0, behavior: "smooth" })
            onFocus?.(event)
          }}
          className={cn(
            "h-full min-w-0 flex-1 bg-transparent text-base text-label outline-none placeholder:text-label-secondary [&::-webkit-search-cancel-button]:appearance-none",
            className
          )}
          {...props}
        />
        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onValueChange("")
              inputRef.current?.focus()
            }}
            className="relative -me-1 flex size-7 shrink-0 items-center justify-center rounded-full outline-none after:absolute after:-inset-2 after:content-[''] focus-visible:focus-ring"
          >
            <XCircleIcon weight="fill" className="size-4.5" />
          </button>
        )}
      </div>
    </div>
  )
}

function SearchRevealContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="search-reveal-content"
      className={cn("min-h-full", className)}
      {...props}
    />
  )
}

export { SearchReveal, SearchRevealContent, SearchRevealField }
