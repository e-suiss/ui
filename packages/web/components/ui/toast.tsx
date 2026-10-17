"use client"

import { Toast as ToastPrimitive } from "@base-ui/react/toast"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

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
        "cn-toast-viewport pointer-events-none fixed bottom-4 z-50 mx-auto w-auto max-w-sm outline-none sm:mx-0 sm:w-full",
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
        "cn-toast pointer-events-auto absolute bottom-0 z-[calc(1000-var(--toast-index))] w-full origin-bottom bg-popover text-popover-foreground will-change-transform outline-none select-none group/toast",
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
        "cn-toast-content flex h-full items-center gap-3 overflow-hidden p-4 transition-opacity duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] data-behind:opacity-0 data-expanded:opacity-100",
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
      className={cn("cn-toast-title text-sm", className)}
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
      className={cn(
        "cn-toast-description text-sm text-muted-foreground",
        className
      )}
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
      className={cn("cn-toast-action shrink-0", className)}
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
        "cn-toast-close relative shrink-0 text-muted-foreground after:absolute after:-inset-2 after:content-[''] hover:text-foreground",
        className
      )}
      {...props}
    >
      {children ?? (
        <IconPlaceholder
          lucide="XIcon"
          tabler="IconX"
          hugeicons="Cancel01Icon"
          phosphor="XIcon"
          remixicon="RiCloseLine"
          aria-hidden="true"
        />
      )}
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

  if (type === "success") {
    icon = (
      <IconPlaceholder
        lucide="CircleCheckIcon"
        tabler="IconCircleCheck"
        hugeicons="CheckmarkCircle02Icon"
        phosphor="CheckCircleIcon"
        remixicon="RiCheckboxCircleLine"
        className="fill-green-500 text-white"
      />
    )
  }

  if (type === "info") {
    icon = (
      <IconPlaceholder
        lucide="InfoIcon"
        tabler="IconInfoCircle"
        hugeicons="InformationCircleIcon"
        phosphor="InfoIcon"
        remixicon="RiInformationLine"
        className="fill-primary text-primary-foreground"
      />
    )
  }

  if (type === "warning") {
    icon = (
      <IconPlaceholder
        lucide="TriangleAlertIcon"
        tabler="IconAlertTriangle"
        hugeicons="Alert02Icon"
        phosphor="WarningIcon"
        remixicon="RiAlertLine"
        className="fill-orange-500 text-white"
      />
    )
  }

  if (type === "error") {
    icon = (
      <IconPlaceholder
        lucide="CircleXIcon"
        tabler="IconCircleX"
        hugeicons="CancelCircleIcon"
        phosphor="XCircleIcon"
        remixicon="RiCloseCircleLine"
        className="fill-destructive text-white"
      />
    )
  }

  const badge = icon && (
    <span
      data-slot={tracked ? undefined : "toast-icon"}
      aria-hidden="true"
      className={cn(
        "flex size-6 shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:size-6",
        tracked &&
          "absolute inset-0 animate-in duration-300 delay-250 ease-[cubic-bezier(0.3,1.25,0.5,1)] fill-mode-both fade-in zoom-in-50"
      )}
    >
      {icon}
    </span>
  )

  if (!tracked) return badge ?? null

  return (
    <span data-slot="toast-icon" className="cn-toast-icon shrink-0">
      <svg
        aria-hidden
        viewBox="0 0 32 32"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        className={cn(
          "size-6 -rotate-90 transition-opacity duration-200 motion-reduce:transition-none",
          type !== "loading" && "opacity-0 delay-250"
        )}
      >
        <circle cx="16" cy="16" r="14.5" className="stroke-foreground/15" />
        <circle
          ref={ring}
          cx="16"
          cy="16"
          r="14.5"
          pathLength="100"
          strokeDasharray="0 100"
          className="stroke-primary"
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
