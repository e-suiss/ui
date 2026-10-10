import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { View } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { TextClassContext } from "@/components/ui/text"

const badgeVariants = cva(
  "h-5 shrink-0 flex-row items-center justify-center gap-1 self-start overflow-hidden rounded-3xl border border-transparent px-2 py-0.5",
  {
    variants: {
      variant: {
        default: "bg-primary",
        secondary: "bg-secondary",
        destructive: "bg-destructive-10 dark:bg-destructive-20",
        outline: "border-border",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const badgeTextVariants = cva("text-xs font-medium", {
  variants: {
    variant: {
      default: "text-primary-foreground",
      secondary: "text-secondary-foreground",
      destructive: "text-destructive",
      outline: "text-foreground",
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
      {element}
    </TextClassContext.Provider>
  )
}

export type { BadgeProps }
export { Badge, badgeTextVariants, badgeVariants }
