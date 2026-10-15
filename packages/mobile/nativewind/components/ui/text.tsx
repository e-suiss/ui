import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { Text as RNText, type Role } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"

const textVariants = cva("text-base text-foreground", {
  variants: {
    variant: {
      default: "",
      h1: "text-3xl font-bold",
      h2: "text-2xl font-bold",
      h3: "text-xl font-semibold",
      h4: "text-lg font-semibold",
      p: "mt-3",
      blockquote: "mt-4 border-s-2 border-border ps-3 italic",
      code: "rounded-sm bg-muted px-1 py-0.5 font-mono text-sm font-semibold",
      lead: "text-lg text-muted-foreground",
      large: "text-lg font-semibold",
      small: "text-sm font-medium",
      muted: "text-sm text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type TextVariantProps = VariantProps<typeof textVariants>

type TextVariant = NonNullable<TextVariantProps["variant"]>

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: "heading",
  h2: "heading",
  h3: "heading",
  h4: "heading",
}

const TextClassContext = React.createContext<string | undefined>(undefined)

function Text({
  className,
  render,
  variant = "default",
  ...props
}: React.ComponentProps<typeof RNText> &
  React.RefAttributes<React.ComponentRef<typeof RNText>> &
  TextVariantProps & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  }) {
  const textClass = React.useContext(TextClassContext)
  return useRender({
    defaultComponent: RNText,
    render,
    props: [
      {
        className: cn(textVariants({ variant }), textClass, className),
        role: variant ? ROLE[variant] : undefined,
      },
      props,
    ],
  })
}

export { Text, TextClassContext }
