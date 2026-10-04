import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"

import { Separator } from "@/components/ui/separator"

const buttonGroupVariants = cva(
  "flex w-fit items-stretch *:data-slot:bg-clip-border [&>[data-variant=ghost]]:rounded-full! [&>[data-variant=plain]]:rounded-full! *:[--focus-ring-offset:-3px] *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[>[data-variant=outline]]:*:data-[slot=input-group]:border-separator has-[>[data-variant=outline]]:*:data-[slot=select-trigger]:border-separator [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[>[data-variant=outline]]:[&>input]:border-separator",
  {
    variants: {
      orientation: {
        horizontal:
          "*:data-slot:rounded-e-none [&>[data-slot]:first-child]:rounded-s-full [&>[data-slot]:not(:has(~[data-slot]))]:rounded-e-full! [&>[data-slot]~[data-slot]]:rounded-s-none [&>[data-slot]~[data-slot]]:border-s-0",
        vertical:
          "flex-col *:data-slot:rounded-b-none [&>[data-slot]:first-child]:rounded-t-2xl [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-2xl! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
      },
    },
    defaultVariants: {
      orientation: "horizontal",
    },
  }
)

function ButtonGroup({
  className,
  orientation,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof buttonGroupVariants>) {
  return (
    <div
      role="group"
      data-slot="button-group"
      data-orientation={orientation}
      className={cn(buttonGroupVariants({ orientation }), className)}
      {...props}
    />
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    props: mergeProps<"div">(
      {
        className: cn(
          "flex items-center gap-2 rounded-full bg-control px-2.5 text-sm [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4",
          className
        ),
      },
      props
    ),
    render,
    state: {
      slot: "button-group-text",
    },
  })
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      data-slot="button-group-separator"
      orientation={orientation}
      className={cn(
        "relative z-10 bg-label/20 data-horizontal:mx-2.25 data-horizontal:-mb-px data-horizontal:w-auto data-vertical:my-2.25 data-vertical:-me-px data-vertical:h-auto",
        className
      )}
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
