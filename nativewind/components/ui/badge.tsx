import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { View } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { IconClassContext } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const badgeVariants = cva(
  "h-5 shrink-0 flex-row items-center justify-center gap-1 self-start overflow-hidden rounded-full border border-transparent",
  {
    variants: {
      variant: {
        default: "",
        secondary: "",
        destructive: "",
        outline: "border-separator px-2",
        ghost: "px-2",
        link: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const badgeTextVariants = cva("text-xs font-semibold", {
  variants: {
    variant: {
      default: "text-link",
      secondary: "text-label-secondary",
      destructive: "text-danger",
      outline: "text-label",
      ghost: "text-label",
      link: "text-link",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type BadgeProps = React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  } & VariantProps<typeof badgeVariants>

function Badge({ className, variant, render, ...props }: BadgeProps) {
  const element = useRender({
    defaultComponent: View,
    render,
    props: [{ className: cn(badgeVariants({ variant }), className) }, props],
  })
  return (
    <TextClassContext.Provider value={badgeTextVariants({ variant })}>
      <IconClassContext.Provider value="size-3">
        {element}
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

export type { BadgeProps }
export { Badge, badgeTextVariants, badgeVariants }
