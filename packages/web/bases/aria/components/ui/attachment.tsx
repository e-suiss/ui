import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import {
  ProgressBar as ProgressBarPrimitive,
  type ProgressBarProps as ProgressBarPrimitiveProps,
} from "react-aria-components"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const attachmentVariants = cva(
  "cn-attachment group/attachment flex max-w-full shrink-0 flex-wrap transition-colors",
  {
    variants: {
      size: {
        default: "cn-attachment-size-default",
        sm: "cn-attachment-size-sm",
        xs: "cn-attachment-size-xs",
      },
      orientation: {
        horizontal: "cn-attachment-orientation-horizontal",
        vertical: "cn-attachment-orientation-vertical",
      },
    },
  }
)

function Attachment({
  className,
  state = "done",
  size = "default",
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentVariants> & {
    state?: "idle" | "uploading" | "processing" | "error" | "done"
  }) {
  return (
    <div
      data-slot="attachment"
      data-state={state}
      data-size={size}
      data-orientation={orientation}
      className={cn(attachmentVariants({ size, orientation }), className)}
      {...props}
    />
  )
}

const attachmentMediaVariants = cva(
  "cn-attachment-media relative flex shrink-0 justify-center overflow-hidden [&_svg]:pointer-events-none group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "cn-attachment-media-variant-icon",
        document: "cn-attachment-media-variant-document",
        image:
          "cn-attachment-media-variant-image *:[img]:size-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

function AttachmentLabel({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-label"
      className={cn("cn-attachment-label", className)}
      {...props}
    />
  )
}

function AttachmentMedia({
  className,
  variant = "icon",
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof attachmentMediaVariants>) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    />
  )
}

function AttachmentContent({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-content"
      className={cn(
        "cn-attachment-content max-w-full min-w-0 flex-1 has-data-[slot=attachment-progress]:*:data-[slot=attachment-title]:pe-12",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTitle({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-title"
      className={cn(
        "cn-attachment-title block max-w-full min-w-0 truncate",
        className
      )}
      {...props}
    />
  )
}

function AttachmentDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="attachment-description"
      className={cn(
        "cn-attachment-description block min-w-0 truncate",
        className
      )}
      {...props}
    />
  )
}

function AttachmentProgress({
  className,
  ...props
}: Omit<ProgressBarPrimitiveProps, "className" | "children"> & {
  className?: string
}) {
  return (
    <ProgressBarPrimitive
      data-slot="attachment-progress"
      className={cn("cn-attachment-progress", className)}
      {...props}
    >
      {({ percentage, valueText, isIndeterminate }) => (
        <>
          <span className="absolute inset-e-0 bottom-full mb-2 text-sm text-muted-foreground tabular-nums">
            {isIndeterminate ? null : valueText}
          </span>
          <div className="h-1 overflow-hidden rounded-full bg-foreground/10">
            <div
              data-slot="attachment-progress-indicator"
              className="cn-attachment-progress-indicator"
              style={
                isIndeterminate ? undefined : { width: `${percentage ?? 0}%` }
              }
            />
          </div>
        </>
      )}
    </ProgressBarPrimitive>
  )
}

function AttachmentActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-actions"
      className={cn(
        "cn-attachment-actions flex shrink-0 items-center",
        className
      )}
      {...props}
    />
  )
}

function AttachmentAction({
  className,
  variant = "secondary",
  size,
  ...props
}: React.ComponentProps<typeof Button>) {
  const isText = variant === "link"

  return (
    <Button
      data-slot="attachment-action"
      variant={variant}
      size={size ?? (isText ? "sm" : "icon-xs")}
      className={cn(
        isText
          ? "h-auto px-0 text-base"
          : "relative size-7 text-muted-foreground after:absolute after:-inset-2.25 group-data-[size=sm]/attachment:size-6 group-data-[size=sm]/attachment:after:-inset-2.75 group-data-[size=xs]/attachment:size-5 group-data-[size=xs]/attachment:after:-inset-3.25 hover:text-foreground group-data-[orientation=vertical]/attachment:bg-black/50 group-data-[orientation=vertical]/attachment:text-white group-data-[orientation=vertical]/attachment:backdrop-blur-sm group-data-[orientation=vertical]/attachment:hover:bg-black/60 group-data-[orientation=vertical]/attachment:hover:text-white group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-2.5",
        className
      )}
      {...props}
    />
  )
}

function AttachmentTrigger({
  className,
  render,
  type,
  ...props
}: React.ComponentProps<"button"> & {
  render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
}) {
  const merged = {
    "data-slot": "attachment-trigger",
    type: render ? type : (type ?? "button"),
    className: cn("absolute inset-0 z-10 outline-none", className),
    ...props,
  }
  if (render) return render(merged as React.HTMLAttributes<HTMLElement>)
  return <button {...merged} />
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn("cn-attachment-group flex min-w-0", className)}
      {...props}
    />
  )
}

export {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentLabel,
  AttachmentMedia,
  AttachmentProgress,
  AttachmentTitle,
  AttachmentTrigger,
}
