import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type * as React from "react"

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
          "[--bubble-bg:var(--accent)] *:data-[slot=bubble-content]:text-on-accent [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:var(--accent-hover)]",
        secondary:
          "[--bubble-bg:var(--control)] *:data-[slot=bubble-content]:text-label [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:var(--control-hover)]",
        muted:
          "[--bubble-bg:var(--surface-secondary)] [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--surface-secondary),var(--label)_5%)]",
        tinted:
          "[--bubble-bg:color-mix(in_oklab,var(--accent)_12%,transparent)] *:data-[slot=bubble-content]:text-label [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:color-mix(in_oklab,var(--accent)_20%,transparent)]",
        outline:
          "[--bubble-bg:var(--surface)] *:data-[slot=bubble-content]:border-separator [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:var(--control)] [&>[data-slot=bubble-content]:is(button,a):hover]:text-label",
        ghost:
          "*:data-[slot=bubble-content]:rounded-none *:data-[slot=bubble-content]:p-0 [&>[data-slot=bubble-content]:is(button,a):hover]:bg-item-hover [&>[data-slot=bubble-content]:is(button,a):hover]:text-label",
        destructive:
          "[--bubble-bg:var(--danger-surface)] *:data-[slot=bubble-content]:text-danger [&>[data-slot=bubble-content]:is(button,a):hover]:[--bubble-bg:var(--danger-surface-hover)] [&>[data-slot=bubble-content]:is(button,a):hover]:text-[color-mix(in_oklab,var(--danger),var(--label)_15%)] dark:[&>[data-slot=bubble-content]:is(button,a):hover]:text-danger",
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
          "w-fit max-w-full min-w-0 relative rounded-2xl border bg-(--bubble-bg) border-transparent px-3.5 py-1.5 text-base wrap-break-word group-data-[align=end]/bubble:self-end before:absolute before:-start-[8px] before:-bottom-px before:hidden before:h-2.5 before:w-[7px] before:bg-(--bubble-bg) before:[clip-path:path('M7_0A10_10_0_0_1_0_9.54V10H7Z')] rtl:before:-scale-x-100 group-data-[align=end]/bubble:before:start-auto group-data-[align=end]/bubble:before:-end-[8px] group-data-[align=end]/bubble:before:-scale-x-100 rtl:group-data-[align=end]/bubble:before:scale-x-100 [[data-slot=bubble][data-align=start]:not([data-variant=ghost]):not([data-variant=outline]):not(:has(+[data-slot=bubble][data-align=start]))>&]:before:block [[data-slot=bubble][data-align=start]:not([data-variant=ghost]):not([data-variant=outline]):not(:has(+[data-slot=bubble][data-align=start]))>&]:rounded-es-none [[data-slot=bubble][data-align=end]:not([data-variant=ghost]):not([data-variant=outline]):not(:has(+[data-slot=bubble][data-align=end]))>&]:before:block [[data-slot=bubble][data-align=end]:not([data-variant=ghost]):not([data-variant=outline]):not(:has(+[data-slot=bubble][data-align=end]))>&]:rounded-ee-none [button]:text-start [button,a]:transition-colors [button,a]:outline-none [button,a]:focus-visible:focus-ring",
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
  "absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-surface-raised px-1.5 py-0.5 text-sm shadow-md dark:bg-surface-tertiary has-[button]:p-0",
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
