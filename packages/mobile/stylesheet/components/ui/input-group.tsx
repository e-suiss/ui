import * as React from "react"
import {
  Pressable,
  StyleSheet,
  type TextInput,
  View,
  type ViewProps,
} from "react-native"
import { useFieldRootContext } from "@/components/primitives/field"
import { Button, type ButtonSize } from "@/components/ui/button"
import { IconSizeContext } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Text, TextStyleContext } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type InputGroupAlign =
  | "inline-start"
  | "inline-end"
  | "block-start"
  | "block-end"

type InputGroupContextProps = {
  block: boolean
  disabled: boolean
  inputRef: React.RefObject<TextInput | null>
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

const styles = StyleSheet.create({
  root: {
    position: "relative",
    height: 44,
    width: "100%",
    minWidth: 0,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
  },
  auto: { height: "auto", borderRadius: radius.xl },
  block: { flexDirection: "column", alignItems: "stretch" },
  addon: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  "inline-start": { paddingStart: 12 },
  "inline-end": { paddingEnd: 12 },
  "block-start": {
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  "block-end": {
    width: "100%",
    justifyContent: "flex-start",
    paddingHorizontal: 12,
    paddingBottom: 12,
  },
  control: {
    borderRadius: 0,
    borderWidth: 0,
    backgroundColor: "transparent",
  },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function alignOf(node: React.ReactNode): InputGroupAlign | null {
  if (!React.isValidElement<{ align?: InputGroupAlign }>(node)) return null
  if (node.type !== InputGroupAddon) return null
  return node.props.align ?? "inline-start"
}

function InputGroup({
  style,
  children,
  disabled = false,
  invalid,
  ...props
}: ViewProps & { disabled?: boolean; invalid?: boolean }) {
  const { colors, isDark } = useTheme()
  const field = useFieldRootContext()
  const inputRef = React.useRef<TextInput | null>(null)
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
        style={[
          styles.root,
          { backgroundColor: colors.secondary },
          (block || multiline) && styles.auto,
          block && styles.block,
          focused && { borderColor: colors.ring },
          isInvalid && {
            borderColor: colors.destructive,
            backgroundColor: withAlpha(colors.destructive, isDark ? 0.1 : 0.05),
          },
          isDisabled && { opacity: 0.5 },
          style,
        ]}
        {...props}
      >
        {ordered}
      </View>
    </InputGroupContext.Provider>
  )
}

function InputGroupAddon({
  style,
  align = "inline-start",
  onPress,
  ...props
}: React.ComponentProps<typeof Pressable> & { align?: InputGroupAlign }) {
  const { colors } = useTheme()
  const { inputRef } = useInputGroup()
  const color = colors.mutedForeground
  return (
    <TextStyleContext.Provider value={{ ...fontSize.base, color }}>
      <IconSizeContext.Provider value={16}>
        <Pressable
          accessible={false}
          style={(state) => [
            styles.addon,
            styles[align],
            typeof style === "function" ? style(state) : style,
          ]}
          onPress={(event) => {
            onPress?.(event)
            inputRef.current?.focus()
          }}
          {...props}
        />
      </IconSizeContext.Provider>
    </TextStyleContext.Provider>
  )
}

const BUTTON_SIZE = {
  xs: "xs",
  sm: "sm",
  "icon-xs": "icon-xs",
  "icon-sm": "icon-sm",
} as const satisfies Record<string, ButtonSize>

function InputGroupButton({
  style,
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
      style={(state) => [
        { borderRadius: radius.full },
        size === "xs" && { paddingHorizontal: 6 },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function InputGroupText(props: React.ComponentProps<typeof Text>) {
  return <Text {...props} />
}

type FocusHandler = NonNullable<React.ComponentProps<typeof Input>["onFocus"]>

type BlurHandler = NonNullable<React.ComponentProps<typeof Input>["onBlur"]>

function useControl(
  ref: React.Ref<TextInput> | undefined,
  onFocus: FocusHandler | undefined,
  onBlur: BlurHandler | undefined
) {
  const { block, disabled, inputRef, setFocused } = useInputGroup()
  return {
    block,
    disabled,
    ref: (node: TextInput | null) => {
      inputRef.current = node
      if (typeof ref === "function") ref(node)
      else if (ref) ref.current = node
    },
    onFocus: (event: Parameters<FocusHandler>[0]) => {
      setFocused(true)
      onFocus?.(event)
    },
    onBlur: (event: Parameters<BlurHandler>[0]) => {
      setFocused(false)
      onBlur?.(event)
    },
  }
}

function InputGroupInput({
  style,
  onFocus,
  onBlur,
  ref,
  ...props
}: React.ComponentProps<typeof Input>) {
  const control = useControl(ref, onFocus, onBlur)
  return (
    <Input
      {...props}
      ref={control.ref}
      disabled={control.disabled || props.disabled}
      onFocus={control.onFocus}
      onBlur={control.onBlur}
      style={(state) => [
        styles.control,
        control.block ? { width: "100%" } : { flex: 1 },
        typeof style === "function" ? style(state) : style,
      ]}
    />
  )
}

function InputGroupTextarea({
  style,
  onFocus,
  onBlur,
  ref,
  ...props
}: React.ComponentProps<typeof Textarea>) {
  const control = useControl(ref, onFocus, onBlur)
  return (
    <Textarea
      {...props}
      ref={control.ref}
      disabled={control.disabled || props.disabled}
      onFocus={control.onFocus}
      onBlur={control.onBlur}
      style={(state) => [
        styles.control,
        { width: "100%", flex: 1, paddingVertical: 10 },
        typeof style === "function" ? style(state) : style,
      ]}
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
