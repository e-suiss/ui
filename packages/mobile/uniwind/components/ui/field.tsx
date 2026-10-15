import { cn } from "cn"
import * as React from "react"
import { Text as RNText, View } from "react-native"
import * as FieldPrimitive from "@/components/primitives/field"
import * as FieldsetPrimitive from "@/components/primitives/fieldset"
import { resolveClassName } from "@/components/primitives/use-render"
import { Separator } from "@/components/ui/separator"

type FieldGroupVariant = "default" | "inset"

type FieldOrientation = "vertical" | "horizontal" | "responsive"

interface FieldGroupItemContextValue {
  variant: FieldGroupVariant
  index: number
}

const FieldGroupItemContext =
  React.createContext<FieldGroupItemContextValue | null>(null)

const FieldSetInsetContext = React.createContext(false)

const FieldInsetContext = React.createContext(false)

function FieldSet({
  className,
  children,
  ...props
}: React.ComponentProps<typeof FieldsetPrimitive.Root>) {
  const inset = React.Children.toArray(children).some(
    (child) =>
      React.isValidElement<{ variant?: FieldGroupVariant }>(child) &&
      child.type === FieldGroup &&
      child.props.variant === "inset"
  )
  return (
    <FieldSetInsetContext.Provider value={inset}>
      <FieldsetPrimitive.Root
        className={(state) =>
          cn(
            "flex-col",
            inset ? "gap-2" : "gap-6",
            resolveClassName(className, state)
          )
        }
        {...props}
      >
        {children}
      </FieldsetPrimitive.Root>
    </FieldSetInsetContext.Provider>
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<typeof FieldsetPrimitive.Legend> & {
  variant?: "legend" | "label"
}) {
  const inset = React.useContext(FieldSetInsetContext)
  return (
    <FieldsetPrimitive.Legend
      role={variant === "legend" ? "heading" : undefined}
      className={(state) =>
        cn(
          "mb-3 text-base font-semibold text-foreground",
          inset &&
            "mb-0 ps-4 text-xs font-normal uppercase text-muted-foreground",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function FieldGroup({
  className,
  variant = "default",
  children,
  ...props
}: React.ComponentProps<typeof View> & { variant?: FieldGroupVariant }) {
  let index = 0
  const items = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child
    const value = { variant, index }
    index += 1
    return (
      <FieldGroupItemContext.Provider value={value}>
        {child}
      </FieldGroupItemContext.Provider>
    )
  })
  return (
    <FieldSetInsetContext.Provider value={false}>
      <View
        className={cn(
          "w-full flex-col gap-7",
          variant === "inset" && "gap-0 overflow-hidden rounded-2xl bg-muted",
          className
        )}
        {...props}
      >
        {items}
      </View>
    </FieldSetInsetContext.Provider>
  )
}

const ORIENTATION_CLASS: Record<FieldOrientation, string> = {
  vertical: "flex-col",
  horizontal: "flex-row items-center",
  responsive: "flex-col md:flex-row md:items-center",
}

function Field({
  className,
  orientation = "vertical",
  children,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Root> & {
  orientation?: FieldOrientation
}) {
  const item = React.useContext(FieldGroupItemContext)
  const inset = item?.variant === "inset"
  return (
    <FieldGroupItemContext.Provider value={null}>
      <FieldInsetContext.Provider value={inset}>
        <FieldPrimitive.Root
          className={(state) =>
            cn(
              "w-full gap-3",
              ORIENTATION_CLASS[orientation],
              inset && "relative min-h-11 justify-center px-4 py-1.5",
              resolveClassName(className, state)
            )
          }
          {...props}
        >
          {inset && item.index > 0 ? (
            <View className="absolute end-0 start-4 top-0 h-px bg-border" />
          ) : null}
          {children}
        </FieldPrimitive.Root>
      </FieldInsetContext.Provider>
    </FieldGroupItemContext.Provider>
  )
}

function FieldContent({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return <View className={cn("flex-1 flex-col gap-1", className)} {...props} />
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Label>) {
  const inset = React.useContext(FieldInsetContext)
  return (
    <FieldPrimitive.Label
      className={(state) =>
        cn(
          "text-base font-semibold text-foreground",
          inset && "font-normal",
          state.disabled && "opacity-50",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function FieldTitle({
  className,
  ...props
}: React.ComponentProps<typeof RNText>) {
  const field = FieldPrimitive.useFieldRootContext()
  return (
    <RNText
      className={cn(
        "text-base font-semibold text-foreground",
        field.state.disabled && "opacity-50",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({
  className,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Description>) {
  const inset = React.useContext(FieldSetInsetContext)
  return (
    <FieldPrimitive.Description
      className={(state) =>
        cn(
          "text-start text-sm font-normal text-muted-foreground",
          inset && "ps-4 text-xs",
          resolveClassName(className, state)
        )
      }
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<typeof View> & { children?: React.ReactNode }) {
  return (
    <View
      className={cn("relative -my-2 h-5 justify-center", className)}
      {...props}
    >
      <Separator className="absolute start-0 top-1/2" />
      {children ? (
        <RNText className="self-center bg-background px-2 text-sm text-muted-foreground">
          {children}
        </RNText>
      ) : null}
    </View>
  )
}

function errorContent(messages: string[]) {
  if (messages.length === 1) return messages[0]
  if (messages.length > 1) {
    return messages.map((message) => `• ${message}`).join("\n")
  }
  return undefined
}

function FieldError({
  className,
  children,
  errors,
  match,
  ...props
}: React.ComponentProps<typeof FieldPrimitive.Error> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const messages = React.useMemo(() => {
    if (!errors?.length) return []
    return [
      ...new Set(
        errors
          .map((error) => error?.message)
          .filter((message): message is string => Boolean(message))
      ),
    ]
  }, [errors])

  const content = children ?? errorContent(messages)

  return (
    <FieldPrimitive.Error
      match={match ?? (content !== undefined ? true : undefined)}
      className={(state) =>
        cn(
          "text-sm font-normal text-destructive",
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {content}
    </FieldPrimitive.Error>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
