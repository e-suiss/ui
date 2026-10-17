import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"
import type * as React from "react"
import { cn } from "@/lib/utils"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("cn-bubble-group flex min-w-0 flex-col", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "cn-bubble group/bubble relative flex w-fit min-w-0 flex-col",
  {
    variants: {
      variant: {
        default:
          "cn-bubble-variant-default *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--primary)_80%,transparent)]",
        secondary:
          "cn-bubble-variant-secondary *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--secondary)_80%,transparent)]",
        muted:
          "cn-bubble-variant-muted [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--muted),var(--foreground)_5%)]",
        tinted:
          "cn-bubble-variant-tinted *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--primary)_20%,transparent)]",
        outline:
          "cn-bubble-variant-outline *:data-[slot=bubble-content]:border-border [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:var(--secondary)] [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        ghost:
          "cn-bubble-variant-ghost *:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-accent [&>[data-slot=bubble-content]:is(button,a):hover]:text-accent-foreground",
        destructive:
          "cn-bubble-variant-destructive *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--destructive)_20%,transparent)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--destructive)_30%,transparent)] [&>[data-slot=bubble-content]:is(button,a):hover]:text-[color-mix(in_oklab,var(--destructive),var(--foreground)_15%)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Bubble({
  variant = "default",
  align = "start",
  className,
  ...props
}: React.ComponentProps<"div"> &
  VariantProps<typeof bubbleVariants> & {
    align?: "start" | "end"
  }) {
  return (
    <div
      data-slot="bubble"
      data-variant={variant}
      data-align={align}
      className={cn(bubbleVariants({ variant }), className)}
      {...props}
    />
  )
}

function BubbleContent({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      data-slot="bubble-content"
      className={cn(
        "cn-bubble-content max-w-full min-w-0 wrap-break-word [button,a]:transition-colors",
        className
      )}
      {...props}
    />
  )
}

const bubbleReactionsVariants = cva(
  "cn-bubble-reactions absolute z-10 flex w-fit items-center justify-center",
  {
    variants: {
      side: {
        top: "cn-bubble-reactions-side-top",
        bottom: "cn-bubble-reactions-side-bottom",
      },
      align: {
        start: "cn-bubble-reactions-align-start",
        end: "cn-bubble-reactions-align-end",
      },
    },
    defaultVariants: {
      side: "bottom",
      align: "end",
    },
  }
)

function BubbleReactions({
  side = "bottom",
  align = "end",
  className,
  ...props
}: React.ComponentProps<"div"> & {
  align?: "start" | "end"
  side?: "top" | "bottom"
}) {
  return (
    <div
      data-slot="bubble-reactions"
      data-align={align}
      data-side={side}
      className={cn(bubbleReactionsVariants({ side, align }), className)}
      {...props}
    />
  )
}

export { Bubble, BubbleContent, BubbleGroup, BubbleReactions }
