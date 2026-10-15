import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "@/lib/utils"

function BubbleGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="bubble-group"
      className={cn("flex min-w-0 flex-col gap-2", className)}
      {...props}
    />
  )
}

const bubbleVariants = cva(
  "group/bubble relative flex w-fit has-[>[data-slot=bubble-reactions][data-side=bottom]]:mb-5 has-[>[data-slot=bubble-reactions][data-side=top]]:mt-5 max-w-[80%] min-w-0 flex-col gap-1 group-data-[align=end]/message:self-end data-[align=end]:self-end data-[variant=ghost]:max-w-full",
  {
    variants: {
      variant: {
        default:
          "[--bubble-bg:var(--primary)] *:data-[slot=bubble-content]:text-primary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--primary)_80%,transparent)]",
        secondary:
          "[--bubble-bg:var(--secondary)] *:data-[slot=bubble-content]:text-secondary-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--secondary)_80%,transparent)]",
        muted:
          "[--bubble-bg:var(--muted)] [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--muted),var(--foreground)_5%)]",
        tinted:
          "[--bubble-bg:color-mix(in_oklab,var(--primary)_12%,transparent)] *:data-[slot=bubble-content]:text-foreground [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--primary)_20%,transparent)]",
        outline:
          "[--bubble-bg:var(--background)] *:data-[slot=bubble-content]:border-border [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:var(--secondary)] [&>[data-slot=bubble-content]:is(button,a):hover]:text-foreground",
        ghost:
          "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-accent [&>[data-slot=bubble-content]:is(button,a):hover]:text-accent-foreground",
        destructive:
          "[--bubble-bg:color-mix(in_oklab,var(--destructive)_10%,transparent)] dark:[--bubble-bg:color-mix(in_oklab,var(--destructive)_20%,transparent)] *:data-[slot=bubble-content]:text-destructive [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--destructive)_20%,transparent)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--destructive)_30%,transparent)] [&>[data-slot=bubble-content]:is(button,a):hover]:text-[color-mix(in_oklab,var(--destructive),var(--foreground)_15%)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:text-destructive",
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
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "w-fit max-w-full min-w-0 relative rounded-2xl border [background:linear-gradient(var(--bubble-bg),var(--bubble-bg)),var(--bubble-surface,var(--background))] border-transparent px-3.5 py-1.5 text-base wrap-break-word group-data-[align=end]/bubble:self-end group-data-[align=end]/message:self-end before:absolute before:-start-[7.9px] before:-bottom-px before:hidden before:size-5 before:[background:inherit] before:[clip-path:path('M7_0H20V4A16_16_0_0_1_4_20H0V19.54A10_10_0_0_0_7_10Z')] rtl:before:-scale-x-100 group-data-[align=end]/bubble:before:-scale-x-100 group-data-[align=end]/message:before:-scale-x-100 rtl:group-data-[align=end]/bubble:before:scale-x-100 rtl:group-data-[align=end]/message:before:scale-x-100 group-data-[align=end]/bubble:before:start-auto group-data-[align=end]/message:before:start-auto group-data-[align=end]/bubble:before:-end-[7.9px] group-data-[align=end]/message:before:-end-[7.9px] [[data-slot=bubble][data-align=start]:not([data-slot=message][data-align=end]_*):not([data-variant=ghost]):not([data-variant=outline]):not(:has(+[data-slot=bubble][data-align=start]))>&]:before:block [[data-slot=bubble]:is([data-align=end],[data-slot=message][data-align=end]_*):not([data-variant=ghost]):not([data-variant=outline]):not(:has(+[data-slot=bubble]:is([data-align=end],[data-slot=message][data-align=end]_*)))>&]:before:block [button]:text-start [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:focus-ring",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "bubble-content",
    },
  })
}

const bubbleReactionsVariants = cva(
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-[var(--bubble-surface,var(--background))] has-[button]:p-0",
  {
    variants: {
      side: {
        top: "top-0 -translate-y-3/4",
        bottom: "bottom-0 translate-y-3/4",
      },
      align: {
        start: "start-3",
        end: "end-3",
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
