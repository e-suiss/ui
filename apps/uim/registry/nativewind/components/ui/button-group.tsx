import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { View, type ViewProps } from "react-native"
import type { ClassNameProp, RenderProp } from "@/components/primitives/types"
import { resolveClassName, useRender } from "@/components/primitives/use-render"
import {
  Button,
  ButtonClassContext,
  type ButtonVariant,
} from "@/components/ui/button"
import { IconClassContext } from "@/components/ui/icon"
import { Separator } from "@/components/ui/separator"
import { TextClassContext } from "@/components/ui/text"

type ButtonGroupOrientation = "horizontal" | "vertical"

const buttonGroupVariants = cva("items-stretch self-start", {
  variants: {
    orientation: {
      horizontal: "flex-row",
      vertical: "flex-col",
    },
  },
  defaultVariants: {
    orientation: "horizontal",
  },
})

function positionClassName(
  orientation: ButtonGroupOrientation,
  first: boolean,
  last: boolean
) {
  if (orientation === "vertical") {
    return cn(
      first ? "rounded-t-2xl" : "rounded-t-none border-t-0",
      last ? "rounded-b-2xl" : "rounded-b-none"
    )
  }
  return cn(
    first ? "rounded-l-full" : "rounded-l-none border-l-0",
    last ? "rounded-r-full" : "rounded-r-none"
  )
}

function joinedButtonClassName(className: string) {
  return (variant: ButtonVariant) =>
    variant === "ghost" || variant === "plain" ? undefined : className
}

function withClassName(child: React.ReactElement, className: string) {
  const element = child as React.ReactElement<{ className?: unknown }>
  const current = element.props.className as ClassNameProp<unknown> | undefined
  return React.cloneElement(element, {
    className:
      typeof current === "function"
        ? (state: unknown) => cn(className, resolveClassName(current, state))
        : cn(className, current),
  })
}

function ButtonGroup({
  className,
  orientation = "horizontal",
  children,
  ...props
}: ViewProps & VariantProps<typeof buttonGroupVariants>) {
  const resolved = orientation ?? "horizontal"
  const items = React.Children.toArray(children).filter(React.isValidElement)
  const nested = items.some((child) => child.type === ButtonGroup)
  return (
    <View
      role="group"
      className={cn(
        buttonGroupVariants({ orientation }),
        nested && "gap-2",
        className
      )}
      {...props}
    >
      {items.map((child, index) => {
        if (child.type === ButtonGroup || child.type === ButtonGroupSeparator) {
          return (
            <ButtonClassContext.Provider key={child.key} value={undefined}>
              {child}
            </ButtonClassContext.Provider>
          )
        }
        const position = positionClassName(
          resolved,
          index === 0,
          index === items.length - 1
        )
        return (
          <ButtonClassContext.Provider
            key={child.key}
            value={joinedButtonClassName(position)}
          >
            {child.type === Button ? child : withClassName(child, position)}
          </ButtonClassContext.Provider>
        )
      })}
    </View>
  )
}

function ButtonGroupText({
  className,
  render,
  ...props
}: ViewProps & {
  render?: RenderProp<Record<string, unknown>, Record<string, never>>
}) {
  const element = useRender({
    defaultComponent: View,
    render,
    props: [
      {
        className: cn(
          "flex-row items-center gap-2 rounded-full bg-control px-2.5",
          className
        ),
      },
      props,
    ],
  })
  return (
    <TextClassContext.Provider value="text-sm text-label">
      <IconClassContext.Provider value="size-4 text-label">
        {element}
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

function ButtonGroupSeparator({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<typeof Separator>) {
  return (
    <Separator
      orientation={orientation}
      className={(state) =>
        cn(
          "relative z-10 bg-label-20",
          state.orientation === "horizontal"
            ? "-mb-px mx-[0.5625rem] w-auto"
            : "-mr-px my-[0.5625rem]",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

export { ButtonGroup, ButtonGroupSeparator, ButtonGroupText }
