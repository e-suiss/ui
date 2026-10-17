import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import * as React from "react"
import { Pressable, type TextInput, View, type ViewProps } from "react-native"
import { useFieldRootContext } from "@/components/primitives/field"
import { resolveClassName } from "@/components/primitives/use-render"
import { Button } from "@/components/ui/button"
import { IconClassContext } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Text, TextClassContext } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"

type InputGroupAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end"

type InputGroupContextProps = {
  block: boolean
  disabled: boolean
  inputRef: React.RefObject<React.ComponentRef<typeof TextInput> | null>
  setFocused: (focused: boolean) => void
}

const InputGroupContext = React.createContext<InputGroupContextProps | null>(
  null
)

function useInputGroup() {
  const context = React.useContext(InputGroupContext)
  if (!context) {
    throw new Error("useInputGroup must be used within an <InputGroup />")
  }
  return context
}

const START: InputGroupAlign[] = ["inline-start", "block-start"]

function alignOf(node: React.ReactNode): InputGroupAlign | null {
  if (!React.isValidElement<{ align?: InputGroupAlign }>(node)) return null
  if (node.type !== InputGroupAddon) return null
  return node.props.align ?? "inline-start"
}

function InputGroup({
  className,
  children,
  disabled = false,
  invalid,
  ...props
}: ViewProps & { disabled?: boolean; invalid?: boolean }) {
  const field = useFieldRootContext()
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput> | null>(
    null
  )
  const [focused, setFocused] = React.useState(false)
  const isDisabled = disabled || field.state.disabled
  const isInvalid = invalid ?? field.state.invalid
  const nodes = React.Children.toArray(children)
  const aligns = nodes.map(alignOf)
  const block = aligns.some(
    (align) => align === "block-start" || align === "block-end"
  )
  const multiline = nodes.some(
    (node) => React.isValidElement(node) && node.type === InputGroupTextarea
  )
  const ordered = [
    ...nodes.filter((_, index) =>
      START.includes(aligns[index] as InputGroupAlign)
    ),
    ...nodes.filter((_, index) => aligns[index] === null),
    ...nodes.filter(
      (_, index) =>
        aligns[index] !== null &&
        !START.includes(aligns[index] as InputGroupAlign)
    ),
  ]
  const contextValue = React.useMemo(
    () => ({ block, disabled: isDisabled, inputRef, setFocused }),
    [block, isDisabled]
  )
  return (
    <InputGroupContext.Provider value={contextValue}>
      <View
        role="group"
        className={cn(
          "relative h-input w-full min-w-0 flex-row items-center rounded-input border border-transparent bg-secondary",
          (block || multiline) && "h-auto rounded-textarea",
          block && "flex-col items-stretch",
          focused && "border-ring ring-3 ring-ring/50",
          isInvalid &&
            "border-destructive bg-destructive/5 dark:bg-destructive/10",
          isDisabled && "opacity-50",
          className
        )}
        {...props}
      >
        {ordered}
      </View>
    </InputGroupContext.Provider>
  )
}

const inputGroupAddonVariants = cva(
  "flex-row items-center justify-center gap-2 py-2",
  {
    variants: {
      align: {
        "inline-start": "ps-3",
        "inline-end": "pe-3",
        "block-start": "w-full justify-start px-3 pt-3",
        "block-end": "w-full justify-start px-3 pb-3",
      },
    },
    defaultVariants: {
      align: "inline-start",
    },
  }
)

function InputGroupAddon({
  className,
  align = "inline-start",
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable> &
  VariantProps<typeof inputGroupAddonVariants>) {
  const { inputRef } = useInputGroup()
  return (
    <TextClassContext.Provider value="text-base text-muted-foreground">
      <IconClassContext.Provider value="size-4 text-muted-foreground">
        <Pressable
          accessible={false}
          className={cn(inputGroupAddonVariants({ align }), className)}
          onPress={(event) => {
            onPress?.(event)
            inputRef.current?.focus()
          }}
          {...props}
        />
      </IconClassContext.Provider>
    </TextClassContext.Provider>
  )
}

const BUTTON_SIZE = {
  xs: "xs",
  sm: "sm",
  "icon-xs": "icon-xs",
  "icon-sm": "icon-sm",
} as const

function InputGroupButton({
  className,
  variant = "ghost",
  size = "xs",
  ...props
}: Omit<React.ComponentProps<typeof Button>, "size"> & {
  size?: keyof typeof BUTTON_SIZE
}) {
  return (
    <Button
      variant={variant}
      size={BUTTON_SIZE[size]}
      className={cn("rounded-full", size === "xs" && "px-1.5", className)}
      {...props}
    />
  )
}

function InputGroupText({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return <Text className={className} {...props} />
}

function InputGroupInput({
  className,
  onFocus,
  onBlur,
  ref,
  ...props
}: React.ComponentProps<typeof Input>) {
  const { block, disabled, inputRef, setFocused } = useInputGroup()
  return (
    <Input
      {...props}
      ref={(node: React.ComponentRef<typeof TextInput> | null) => {
        inputRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      disabled={disabled || props.disabled}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      className={(state) =>
        cn(
          block ? "w-full" : "flex-1",
          "rounded-none border-0 bg-transparent",
          resolveClassName(className, state)
        )
      }
    />
  )
}

function InputGroupTextarea({
  className,
  onFocus,
  onBlur,
  ref,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  const { disabled, inputRef, setFocused } = useInputGroup()
  return (
    <Textarea
      {...props}
      ref={(node: React.ComponentRef<typeof TextInput> | null) => {
        inputRef.current = node
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      disabled={disabled || props.disabled}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      className={(state) =>
        cn(
          "w-full flex-1 rounded-none border-0 bg-transparent py-2.5",
          resolveClassName(className, state)
        )
      }
    />
  )
}

export {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
}
