import { mergeProps } from "@base-ui/react/merge-props"
import { Progress as ProgressPrimitive } from "@base-ui/react/progress"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type * as React from "react"

import { Button } from "@/components/ui/button"

const attachmentVariants = cva(
  "group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-2xl bg-muted text-foreground transition-colors focus-within:focus-ring has-[>a,>button]:hover:bg-[color-mix(in_oklch,var(--muted),var(--foreground)_5%)] data-[state=idle]:border data-[state=idle]:border-dashed in-data-[slot=attachment-group]:w-full in-data-[slot=attachment-group]:rounded-none in-data-[slot=attachment-group]:border-0 in-data-[slot=attachment-group]:[--focus-ring-offset:-3px] in-data-[slot=attachment-group]:not-first:before:absolute in-data-[slot=attachment-group]:not-first:before:inset-e-0 in-data-[slot=attachment-group]:not-first:before:top-0 in-data-[slot=attachment-group]:not-first:before:start-4 in-data-[slot=attachment-group]:not-first:before:border-t in-data-[slot=attachment-group]:not-first:before:border-border in-data-[slot=attachment-group]:not-first:has-data-[slot=attachment-media]:before:start-16",
  {
    variants: {
      size: {
        default:
          "gap-3 px-4 py-3 text-sm data-[orientation=vertical]:gap-2 data-[orientation=vertical]:has-data-[slot=attachment-content]:px-2.5 data-[orientation=vertical]:has-data-[slot=attachment-content]:py-2 data-[orientation=vertical]:has-data-[slot=attachment-media]:p-2",
        sm: "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
        xs: "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
      },
      orientation: {
        horizontal: "min-w-40 items-center",
        vertical: "w-24 flex-col has-data-[slot=attachment-content]:w-30",
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
  "relative flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-sm group-data-[state=error]/attachment:bg-destructive/8 group-data-[state=error]/attachment:text-destructive group-data-[orientation=vertical]/attachment:*:data-[slot=spinner]:size-6! [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*='size-'])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-3.5",
  {
    variants: {
      variant: {
        icon: "aspect-auto h-11 w-9 rounded-sm border bg-background text-muted-foreground group-data-[orientation=vertical]/attachment:aspect-square group-data-[orientation=vertical]/attachment:h-auto group-data-[size=sm]/attachment:h-10 group-data-[size=xs]/attachment:h-8.5",
        document:
          "aspect-auto h-11 w-9 items-end rounded-sm border bg-background pb-1.5 group-data-[state=error]/attachment:bg-background group-data-[size=sm]/attachment:h-10 group-data-[size=xs]/attachment:h-8.5",
        image:
          "aspect-auto h-11 w-9 group-data-[orientation=vertical]/attachment:aspect-square group-data-[orientation=vertical]/attachment:h-auto group-data-[size=sm]/attachment:h-10 group-data-[size=xs]/attachment:h-8.5 *:[img]:size-full *:[img]:object-cover",
      },
    },
    defaultVariants: {
      variant: "icon",
    },
  }
)

const attachmentLabelVariants = cva(
  "rounded-xs px-1 py-0.5 text-[0.5625rem] leading-none font-bold text-white uppercase",
  {
    variants: {
      tone: {
        red: "bg-[oklch(0.5529_0.2255_27.27)]",
        green: "bg-[oklch(0.5338_0.1429_147.35)]",
        blue: "bg-[oklch(0.5629_0.1933_256.16)]",
        orange: "bg-[oklch(0.5516_0.192_35.33)]",
        gray: "bg-[oklch(0.5399_0.0077_286.14)]",
      },
    },
    defaultVariants: {
      tone: "gray",
    },
  }
)

const extensionTones: Record<
  string,
  VariantProps<typeof attachmentLabelVariants>["tone"]
> = {
  pdf: "red",
  xls: "green",
  xlsx: "green",
  csv: "green",
  numbers: "green",
  doc: "blue",
  docx: "blue",
  pages: "blue",
  rtf: "blue",
  txt: "blue",
  ppt: "orange",
  pptx: "orange",
  key: "orange",
}

function AttachmentLabel({
  className,
  tone,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof attachmentLabelVariants>) {
  return (
    <span
      data-slot="attachment-label"
      className={cn(attachmentLabelVariants({ tone }), className)}
      {...props}
    />
  )
}

function AttachmentMedia({
  className,
  variant = "icon",
  extension,
  children,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof attachmentMediaVariants> & { extension?: string }) {
  return (
    <div
      data-slot="attachment-media"
      data-variant={variant}
      className={cn(attachmentMediaVariants({ variant }), className)}
      {...props}
    >
      {children ??
        (extension && (
          <AttachmentLabel tone={extensionTones[extension.toLowerCase()]}>
            {extension}
          </AttachmentLabel>
        ))}
    </div>
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
        "max-w-full min-w-0 flex-1 group-data-[orientation=vertical]/attachment:px-1 has-data-[slot=attachment-progress]:*:data-[slot=attachment-title]:pe-12",
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
        "block max-w-full min-w-0 truncate group-data-[size=default]/attachment:text-base group-data-[size=sm]/attachment:font-semibold group-data-[size=xs]/attachment:font-semibold",
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
        "mt-0.5 block min-w-0 truncate text-xs text-muted-foreground group-data-[size=default]/attachment:text-sm group-data-[state=error]/attachment:text-destructive",
        "max-w-full",
        className
      )}
      {...props}
    />
  )
}

function AttachmentProgress({
  className,
  ...props
}: ProgressPrimitive.Root.Props) {
  return (
    <ProgressPrimitive.Root
      data-slot="attachment-progress"
      className={cn("relative mt-2", className)}
      {...props}
    >
      <ProgressPrimitive.Value className="absolute end-0 bottom-full mb-2 text-sm text-muted-foreground tabular-nums" />
      <ProgressPrimitive.Track className="h-1 overflow-hidden rounded-full bg-foreground/10">
        <ProgressPrimitive.Indicator className="h-full rounded-full bg-primary transition-all" />
      </ProgressPrimitive.Track>
    </ProgressPrimitive.Root>
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
        "relative z-20 flex shrink-0 items-center group-data-[orientation=vertical]/attachment:absolute group-data-[orientation=vertical]/attachment:top-3 group-data-[orientation=vertical]/attachment:inset-e-3 group-data-[orientation=vertical]/attachment:gap-1",
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
          : "size-7 text-muted-foreground group-data-[size=sm]/attachment:size-6 group-data-[size=xs]/attachment:size-5 hover:text-foreground group-data-[size=xs]/attachment:[&_svg:not([class*='size-'])]:size-2.5",
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
}: useRender.ComponentProps<"button">) {
  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type: render ? type : (type ?? "button"),
        className: cn("absolute inset-0 z-10 outline-none", className),
      },
      props
    ),
    render,
    state: {
      slot: "attachment-trigger",
    },
  })
}

function AttachmentGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="attachment-group"
      className={cn(
        "flex w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-muted",
        className
      )}
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
