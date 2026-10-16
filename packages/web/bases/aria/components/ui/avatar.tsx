"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type ImageStatus = "idle" | "loading" | "loaded" | "error"

const AvatarContext = React.createContext<{
  status: ImageStatus
  setStatus: (status: ImageStatus) => void
} | null>(null)

function Avatar({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"span"> & {
  size?: "default" | "sm" | "lg" | "xl"
}) {
  const [status, setStatus] = React.useState<ImageStatus>("idle")

  return (
    <AvatarContext.Provider value={{ status, setStatus }}>
      <span
        data-slot="avatar"
        data-size={size}
        className={cn(
          "group/avatar relative flex size-8 shrink-0 rounded-full select-none data-[size=lg]:size-10 data-[size=sm]:size-6 data-[size=xl]:size-16",
          className
        )}
        {...props}
      />
    </AvatarContext.Provider>
  )
}

function AvatarImage({
  alt,
  className,
  src,
  srcSet,
  sizes,
  crossOrigin,
  referrerPolicy,
  ...props
}: React.ComponentProps<"img">) {
  const context = React.useContext(AvatarContext)
  const [status, setStatus] = React.useState<ImageStatus>("idle")
  const report = context?.setStatus

  React.useLayoutEffect(() => {
    if (!src && !srcSet) {
      setStatus("error")
      report?.("error")
      return
    }
    let active = true
    const image = new window.Image()
    const update = (next: ImageStatus) => {
      if (!active) return
      setStatus(next)
      report?.(next)
    }
    setStatus("loading")
    report?.("loading")
    image.onload = () => update("loaded")
    image.onerror = () => update("error")
    if (crossOrigin !== undefined) image.crossOrigin = crossOrigin
    if (referrerPolicy) image.referrerPolicy = referrerPolicy
    if (sizes) image.sizes = sizes
    if (srcSet) image.srcset = srcSet
    if (typeof src === "string") image.src = src
    if (image.complete && image.naturalWidth > 0) update("loaded")
    return () => {
      active = false
    }
  }, [src, srcSet, sizes, crossOrigin, referrerPolicy, report])

  if (status !== "loaded") return null

  return (
    <img
      alt={alt}
      data-slot="avatar-image"
      src={src}
      srcSet={srcSet}
      sizes={sizes}
      crossOrigin={crossOrigin}
      referrerPolicy={referrerPolicy}
      className={cn(
        "aspect-square size-full rounded-full object-cover",
        className
      )}
      {...props}
    />
  )
}

function AvatarFallback({
  className,
  delay,
  ...props
}: React.ComponentProps<"span"> & { delay?: number }) {
  const context = React.useContext(AvatarContext)
  const [ready, setReady] = React.useState(delay === undefined)

  React.useEffect(() => {
    if (delay === undefined) return
    const timeout = window.setTimeout(() => setReady(true), delay)
    return () => window.clearTimeout(timeout)
  }, [delay])

  if (context?.status === "loaded" || !ready) return null

  return (
    <span
      data-slot="avatar-fallback"
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-linear-to-b from-muted-foreground/90 to-muted-foreground text-xs font-semibold text-primary-foreground uppercase group-data-[size=lg]/avatar:text-base group-data-[size=sm]/avatar:text-xs group-data-[size=xl]/avatar:text-2xl dark:from-muted-foreground/70 dark:to-muted-foreground/50 *:[svg]:size-3/5",
        className
      )}
      {...props}
    />
  )
}

function AvatarBadge({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="avatar-badge"
      className={cn(
        "absolute inset-e-0 bottom-0 z-10 inline-flex items-center justify-center rounded-full bg-primary text-primary-foreground ring-2 ring-background select-none",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-3 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3.5 group-data-[size=lg]/avatar:[&>svg]:size-2.5",
        "group-data-[size=xl]/avatar:size-4.5 group-data-[size=xl]/avatar:[&>svg]:size-3",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group"
      className={cn(
        "group/avatar-group flex -space-x-2 has-[[data-slot=avatar][data-size=xl]]:-space-x-4 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        className
      )}
      {...props}
    />
  )
}

function AvatarGroupCount({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="avatar-group-count"
      className={cn(
        "relative flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground ring-2 ring-background group-has-data-[size=lg]/avatar-group:size-10 group-has-data-[size=lg]/avatar-group:text-base group-has-data-[size=sm]/avatar-group:size-6 group-has-data-[size=sm]/avatar-group:text-xs group-has-data-[size=xl]/avatar-group:size-16 group-has-data-[size=xl]/avatar-group:text-2xl [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 group-has-data-[size=xl]/avatar-group:[&>svg]:size-7",
        className
      )}
      {...props}
    />
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
}
