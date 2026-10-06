"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import { CheckIcon, ExclamationMarkIcon, XIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"
import { Button } from "@/components/ui/button"

const toast = ToastPrimitive.createToastManager()

function ToastProvider({ ...props }: ToastPrimitive.Provider.Props) {
  return <ToastPrimitive.Provider {...props} />
}

function ToastPortal({ ...props }: ToastPrimitive.Portal.Props) {
  return <ToastPrimitive.Portal data-slot="toast-portal" {...props} />
}

function ToastViewport({ className, ...props }: ToastPrimitive.Viewport.Props) {
  return (
    <ToastPrimitive.Viewport
      data-slot="toast-viewport"
      className={cn(
        "pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:inset-e-4 sm:inset-s-auto sm:mx-0 sm:w-full",
        className
      )}
      {...props}
    />
  )
}

function Toast({ className, ...props }: ToastPrimitive.Root.Props) {
  return (
    <ToastPrimitive.Root
      data-slot="toast"
      className={cn(
        "pointer-events-auto absolute inset-e-0 bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom rounded-xl bg-surface-raised text-label shadow-[0_8px_32px_rgb(0_0_0/0.14)] ring-1 ring-label/5 dark:shadow-lg dark:ring-0 will-change-transform outline-none select-none focus-visible:focus-ring",
        "[--gap:0.75rem] [--height:var(--toast-frontmost-height,var(--toast-height))] [--offset-y:calc(var(--toast-offset-y)*-1+calc(var(--toast-index)*var(--gap)*-1)+var(--toast-swipe-movement-y))] [--peek:0.75rem] [--scale:calc(max(0,1-(var(--toast-index)*0.1)))] [--shrink:calc(1-var(--scale))]",
        "h-(--height) transform-[translateX(var(--toast-swipe-movement-x))_translateY(calc(var(--toast-swipe-movement-y)-(var(--toast-index)*var(--peek))-(var(--shrink)*var(--height))))_scale(var(--scale))] [transition:transform_500ms_cubic-bezier(0.22,1,0.36,1),opacity_500ms,height_150ms,filter_500ms] dark:not-data-expanded:brightness-[calc(1-var(--toast-index)*0.18)]",
        "after:absolute after:top-full after:inset-s-0 after:h-[calc(var(--gap)+1px)] after:w-full after:content-['']",
        "data-expanded:h-(--toast-height) data-expanded:transform-[translateX(var(--toast-swipe-movement-x))_translateY(var(--offset-y))]",
        "data-limited:opacity-0 data-starting-style:transform-[translateY(150%)]",
        "[&[data-ending-style]:not([data-limited]):not([data-swipe-direction])]:transform-[translateY(150%)]",
        "data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=down]:transform-[translateY(calc(var(--toast-swipe-movement-y)+150%))]",
        "data-expanded:data-ending-style:data-[swipe-direction=left]:transform-[translateX(calc(var(--toast-swipe-movement-x)-150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=right]:transform-[translateX(calc(var(--toast-swipe-movement-x)+150%))_translateY(var(--offset-y))]",
        "data-expanded:data-ending-style:data-[swipe-direction=up]:transform-[translateY(calc(var(--toast-swipe-movement-y)-150%))]",
        className
      )}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: ToastPrimitive.Content.Props) {
  return (
    <ToastPrimitive.Content
      data-slot="toast-content"
      className={cn(
        "flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
        className
      )}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: ToastPrimitive.Title.Props) {
  return (
    <ToastPrimitive.Title
      data-slot="toast-title"
      className={cn("text-sm font-semibold", className)}
      {...props}
    />
  )
}

function ToastDescription({
  className,
  ...props
}: ToastPrimitive.Description.Props) {
  return (
    <ToastPrimitive.Description
      data-slot="toast-description"
      className={cn("text-sm text-label-secondary", className)}
      {...props}
    />
  )
}

function ToastAction({
  className,
  render = <Button variant="outline" size="sm" />,
  ...props
}: ToastPrimitive.Action.Props) {
  return (
    <ToastPrimitive.Action
      data-slot="toast-action"
      render={render}
      className={cn("shrink-0", className)}
      {...props}
    />
  )
}

function ToastClose({
  className,
  children,
  render = <Button variant="ghost" size="icon-sm" />,
  ...props
}: ToastPrimitive.Close.Props) {
  return (
    <ToastPrimitive.Close
      data-slot="toast-close"
      aria-label="Close toast"
      render={render}
      className={cn(
        "relative shrink-0 text-label-secondary after:absolute after:-inset-2 after:content-[''] hover:text-label",
        className
      )}
      {...props}
    >
      {children ?? <XIcon aria-hidden="true" />}
    </ToastPrimitive.Close>
  )
}

function ToastIcon({ type }: { type: string | undefined }) {
  const ring = React.useRef<SVGCircleElement>(null)
  const [tracked, setTracked] = React.useState(type === "loading")
  if (type === "loading" && !tracked) setTracked(true)

  React.useLayoutEffect(() => {
    const circle = ring.current
    if (!circle) return
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (type !== "loading") {
      circle.animate([{ strokeDasharray: "100 100" }], {
        duration: still ? 0 : 280,
        easing: "cubic-bezier(0.3, 0, 0.2, 1)",
        fill: "forwards",
      })
      return
    }
    if (still) {
      circle.style.strokeDasharray = "30 100"
      return
    }
    const progress = circle.animate(
      [{ strokeDasharray: "0 100" }, { strokeDasharray: "94 100" }],
      {
        duration: 12000,
        easing: "cubic-bezier(0.1, 0.75, 0.25, 1)",
        fill: "forwards",
      }
    )
    return () => {
      circle.style.strokeDasharray = getComputedStyle(circle).strokeDasharray
      progress.cancel()
    }
  }, [type])

  let icon: React.ReactNode = null
  let tint = ""

  if (type === "success") {
    icon = <CheckIcon weight="bold" />
    tint = "bg-green"
  }

  if (type === "info") {
    icon = <ExclamationMarkIcon weight="bold" className="rotate-180" />
    tint = "bg-accent"
  }

  if (type === "warning") {
    icon = <ExclamationMarkIcon weight="bold" />
    tint = "bg-orange"
  }

  if (type === "error") {
    icon = <XIcon weight="bold" />
    tint = "bg-danger"
  }

  const badge = icon && (
    <span
      data-slot={tracked ? undefined : "toast-icon"}
      aria-hidden="true"
      className={cn(
        "flex size-8 shrink-0 items-center justify-center rounded-full text-surface [&_svg]:pointer-events-none [&_svg]:size-4",
        tracked &&
          "absolute inset-0 animate-in duration-300 delay-250 ease-[cubic-bezier(0.3,1.25,0.5,1)] fill-mode-both fade-in zoom-in-50",
        tint
      )}
    >
      {icon}
    </span>
  )

  if (!tracked) return badge ?? null

  return (
    <span
      data-slot="toast-icon"
      className="relative flex size-8 shrink-0 items-center justify-center"
    >
      <svg
        aria-hidden
        viewBox="0 0 32 32"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="size-8 -rotate-90"
      >
        <circle cx="16" cy="16" r="14.5" className="stroke-label/15" />
        <circle
          ref={ring}
          cx="16"
          cy="16"
          r="14.5"
          pathLength="100"
          strokeDasharray="0 100"
          className="stroke-accent"
        />
      </svg>
      {type !== "loading" && badge}
    </span>
  )
}

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager()

  return toasts.map((toastItem) => (
    <Toast key={toastItem.id} toast={toastItem}>
      <ToastContent>
        <ToastIcon type={toastItem.type} />
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <ToastTitle />
          <ToastDescription />
        </div>
        <ToastAction />
        <ToastClose />
      </ToastContent>
    </Toast>
  ))
}

function Toaster({
  children,
  toastManager = toast,
  ...props
}: ToastPrimitive.Provider.Props) {
  return (
    <ToastProvider toastManager={toastManager} {...props}>
      {children}
      <ToastPortal>
        <ToastViewport>
          <ToastList />
        </ToastViewport>
      </ToastPortal>
    </ToastProvider>
  )
}

const createToastManager = ToastPrimitive.createToastManager
const useToastManager = ToastPrimitive.useToastManager

export {
  createToastManager,
  Toast,
  ToastAction,
  ToastClose,
  ToastContent,
  ToastDescription,
  Toaster,
  ToastPortal,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toast,
  useToastManager,
}
