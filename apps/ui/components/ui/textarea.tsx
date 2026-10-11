"use client"

import { cn } from "cn"
import type * as React from "react"

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
      className="group/textarea-handle absolute cursor-nwse-resize touch-none peer-disabled:hidden after:absolute after:-inset-2 after:content-[''] data-[placement=inside]:inset-e-1 data-[placement=inside]:bottom-1 data-[placement=inside]:size-3 data-[placement=outside]:-inset-e-1.5 data-[placement=outside]:-bottom-1.5 data-[placement=outside]:size-4.5 rtl:-scale-x-100 rtl:cursor-nesw-resize"
    >
      <svg
        aria-hidden
        viewBox={placement === "inside" ? "0 0 12 12" : "0 0 18 18"}
        fill="none"
        strokeWidth="3"
        strokeLinecap="round"
        className="pointer-events-none size-full overflow-visible stroke-label-quaternary transition-[stroke] duration-200 group-hover/textarea-handle:stroke-accent group-data-dragging/textarea-handle:stroke-accent"
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
        "peer flex field-sizing-content min-h-16 w-full resize-none rounded-xl border border-transparent bg-control px-3 py-3 text-base transition-[color,box-shadow,background-color] caret-accent outline-none placeholder:text-label-secondary focus-visible:focus-ring disabled:cursor-not-allowed disabled:bg-control-disabled disabled:text-label-quaternary disabled:placeholder:text-label-quaternary aria-invalid:border-danger aria-invalid:bg-danger/5 data-resizable:field-sizing-fixed data-resizable:min-h-24 dark:aria-invalid:bg-danger/10",
        className
      )}
      {...props}
    />
  )

  if (!resizable) return textarea

  return (
    <div data-slot="textarea-container" className="relative w-full">
      {textarea}
      <TextareaHandle placement={resizable} />
    </div>
  )
}

export { Textarea }
