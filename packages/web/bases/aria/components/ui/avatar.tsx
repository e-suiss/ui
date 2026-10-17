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
          "cn-avatar group/avatar relative flex shrink-0 select-none",
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
        "cn-avatar-image aspect-square size-full object-cover",
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
        "cn-avatar-fallback flex items-center justify-center *:[svg]:size-3/5",
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
        "cn-avatar-badge absolute bottom-0 z-10 inline-flex items-center justify-center rounded-full ring-2 select-none",
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
        "cn-avatar-group group/avatar-group flex *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
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
        "cn-avatar-group-count relative flex shrink-0 items-center justify-center ring-2 ring-background [&>svg]:size-4 group-has-data-[size=lg]/avatar-group:[&>svg]:size-5 group-has-data-[size=sm]/avatar-group:[&>svg]:size-3 group-has-data-[size=xl]/avatar-group:[&>svg]:size-7",
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
