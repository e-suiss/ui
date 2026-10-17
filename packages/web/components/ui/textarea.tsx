"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

function TextareaHandle({ placement }: { placement: "inside" | "outside" }) {
  function startResize(event: React.PointerEvent<HTMLSpanElement>) {
    const handle = event.currentTarget
    const textarea = handle.parentElement?.querySelector<HTMLTextAreaElement>(
      "[data-slot=textarea]"
    )
    if (!textarea || event.button !== 0) return
    event.preventDefault()
    handle.setPointerCapture(event.pointerId)
    handle.dataset.dragging = ""
    const startY = event.clientY
    const startHeight = textarea.offsetHeight
    const minHeight =
      Number.parseFloat(getComputedStyle(textarea).minHeight) || 0
    const move = (moveEvent: PointerEvent) => {
      const height = startHeight + moveEvent.clientY - startY
      textarea.style.height = `${Math.max(minHeight, height)}px`
    }
    const end = () => {
      delete handle.dataset.dragging
      handle.removeEventListener("pointermove", move)
      handle.removeEventListener("pointerup", end)
      handle.removeEventListener("pointercancel", end)
    }
    handle.addEventListener("pointermove", move)
    handle.addEventListener("pointerup", end)
    handle.addEventListener("pointercancel", end)
  }

  function resetSize(event: React.MouseEvent<HTMLSpanElement>) {
    event.currentTarget.parentElement
      ?.querySelector<HTMLTextAreaElement>("[data-slot=textarea]")
      ?.style.removeProperty("height")
  }

  return (
    <span
      aria-hidden="true"
      data-slot="textarea-handle"
      data-placement={placement}
      onPointerDown={startResize}
      onDoubleClick={resetSize}
      className="cn-textarea-handle group/textarea-handle"
    >
      <svg
        aria-hidden
        viewBox={placement === "inside" ? "0 0 12 12" : "0 0 18 18"}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="pointer-events-none size-full overflow-visible stroke-border transition-[stroke] duration-200 group-hover/textarea-handle:stroke-primary group-data-dragging/textarea-handle:stroke-primary"
      >
        <path
          d={
            placement === "inside"
              ? "M11.28 4.11A12 12 0 0 1 4.11 11.28"
              : "M15.97 5.82A17 17 0 0 1 5.82 15.97"
          }
        />
      </svg>
    </span>
  )
}

function Textarea({
  className,
  resizable,
  ...props
}: React.ComponentProps<"textarea"> & {
  resizable?: "inside" | "outside"
}) {
  const textarea = (
    <textarea
      data-slot="textarea"
      data-resizable={resizable}
      className={cn(
        "cn-textarea flex w-full outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 peer",
        className
      )}
      {...props}
    />
  )

  if (!resizable) return textarea

  return (
    <div data-slot="textarea-container" className="cn-textarea-container">
      {textarea}
      <TextareaHandle placement={resizable} />
    </div>
  )
}

export { Textarea }
