import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { View, type ViewProps } from "react-native"
import type { RenderProp } from "@/components/primitives/types"
import { useRender } from "@/components/primitives/use-render"
import { IconClassContext } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type MarkerVariant = "default" | "separator" | "border"

const MarkerContext = React.createContext<MarkerVariant>("default")

const markerVariants = cva("min-h-4 w-full flex-row items-center gap-2", {
  variants: {
    variant: {
      default: "",
      separator: "",
      border: "border-b border-separator pb-2",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function MarkerLine() {
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      className="h-px min-w-0 flex-1 bg-separator"
    />
  )
}

function Marker({
  className,
  variant = "default",
  render,
  children,
  ...props
}: ViewProps &
  VariantProps<typeof markerVariants> & {
    render?: RenderProp<Record<string, unknown>, Record<string, never>>
  }) {
  const resolved = variant ?? "default"
  const separator = resolved === "separator"
  const element = useRender({
    defaultComponent: View,
    render,
    props: [
      {
        className: cn(markerVariants({ variant: resolved }), className),
        children: (
          <>
            {separator ? <MarkerLine /> : null}
            {children}
            {separator ? <MarkerLine /> : null}
          </>
        ),
      },
      props,
    ],
  })
  return (
    <MarkerContext.Provider value={resolved}>
      <TextClassContext.Provider value="text-start text-sm text-label-secondary">
        <IconClassContext.Provider value="size-4 text-label-secondary">
          {element}
        </IconClassContext.Provider>
      </TextClassContext.Provider>
    </MarkerContext.Provider>
  )
}

function MarkerIcon({ className, ...props }: ViewProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className={cn("size-4 shrink-0 items-center justify-center", className)}
      {...props}
    />
  )
}

function MarkerContent({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  const variant = React.useContext(MarkerContext)
  return (
    <Text
      className={cn(
        "min-w-0 shrink",
        variant === "separator" && "flex-none shrink-0 text-center",
        className
      )}
      {...props}
    />
  )
}

export { Marker, MarkerContent, MarkerIcon }
