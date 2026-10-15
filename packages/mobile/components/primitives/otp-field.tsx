import * as React from "react"
import {
  StyleSheet,
  Text,
  TextInput,
  type TextInputProps,
  View,
} from "react-native"
import {
  createChangeEventDetails,
  createGenericEventDetails,
} from "./event-details"
import { useComposedRefs, useEffectEvent } from "./hooks"
import type {
  BaseUIChangeEventDetails,
  BaseUIComponentProps,
  BaseUIGenericEventDetails,
  ChangeEvent,
} from "./types"
import { useRender } from "./use-render"

const OTP_FIELD_REASONS = {
  inputChange: "input-change",
  inputClear: "input-clear",
  inputPaste: "input-paste",
} as const

type ChangeEventReason =
  (typeof OTP_FIELD_REASONS)[keyof typeof OTP_FIELD_REASONS]

type InvalidEventReason = "input-change" | "input-paste"

type CompleteEventReason = "input-change" | "input-paste"

type ChangeEventDetails = BaseUIChangeEventDetails<ChangeEventReason>

type InvalidEventDetails = BaseUIGenericEventDetails<InvalidEventReason>

type CompleteEventDetails = BaseUIGenericEventDetails<CompleteEventReason>

type ValidationType = "numeric" | "alpha" | "alphanumeric" | "none"

interface RootState {
  complete: boolean
  disabled: boolean
  focused: boolean
  length: number
  readOnly: boolean
  required: boolean
  value: string
}

interface InputState extends RootState {
  active: boolean
  caret: boolean
  filled: boolean
  index: number
}

type SeparatorState = RootState

interface Slot {
  char: string
  filled: boolean
  isActive: boolean
  hasFakeCaret: boolean
}

type HiddenInputProps = Omit<
  TextInputProps,
  "value" | "defaultValue" | "onChangeText" | "editable" | "selection" | "style"
>

type RootProps = Omit<
  BaseUIComponentProps<typeof View, RootState>,
  "children"
> & {
  children?: React.ReactNode
  length: number
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?:
    | ((value: string, eventDetails: ChangeEventDetails) => void)
    | undefined
  onValueInvalid?:
    | ((value: string, eventDetails: InvalidEventDetails) => void)
    | undefined
  onValueComplete?:
    | ((value: string, eventDetails: CompleteEventDetails) => void)
    | undefined
  validationType?: ValidationType | undefined
  normalizeValue?: ((value: string) => string) | undefined
  mask?: boolean | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  required?: boolean | undefined
  autoFocus?: boolean | undefined
  inputRef?: React.Ref<TextInput> | undefined
  inputProps?: HiddenInputProps | undefined
}

type InputProps = Omit<
  BaseUIComponentProps<typeof View, InputState>,
  "children"
> & {
  index: number
  children?: React.ReactNode | ((slot: Slot) => React.ReactNode)
}

type SeparatorProps = BaseUIComponentProps<typeof View, SeparatorState>

interface RootContextValue {
  state: RootState
  slots: readonly Slot[]
  focusInput: () => void
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("OTPField parts must be rendered inside OTPField.Root")
  }
  return context
}

function useSlot(index: number): Slot {
  const { slots } = useRootContext()
  return (
    slots[index] ?? {
      char: "",
      filled: false,
      isActive: false,
      hasFakeCaret: false,
    }
  )
}

const PATTERNS: Record<Exclude<ValidationType, "none">, RegExp> = {
  numeric: /^[0-9]$/,
  alpha: /^[a-zA-Z]$/,
  alphanumeric: /^[a-zA-Z0-9]$/,
}

function sanitize(
  text: string,
  length: number,
  validationType: ValidationType,
  normalizeValue: ((value: string) => string) | undefined
): readonly [string, boolean] {
  const stripped = text.replace(/\s/g, "")
  const normalized = normalizeValue ? normalizeValue(stripped) : stripped
  const pattern = validationType === "none" ? null : PATTERNS[validationType]
  const characters = Array.from(normalized)
  const accepted = pattern
    ? characters.filter((character) => pattern.test(character))
    : characters
  return [
    accepted.slice(0, length).join(""),
    accepted.length !== characters.length,
  ]
}

const styles = StyleSheet.create({
  input: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    color: "transparent",
    backgroundColor: "transparent",
    borderWidth: 0,
    padding: 0,
    fontSize: 1,
  },
})

function Root({
  children,
  length,
  value: valueProp,
  defaultValue = "",
  onValueChange,
  onValueInvalid,
  onValueComplete,
  validationType = "numeric",
  normalizeValue,
  mask = false,
  disabled = false,
  readOnly = false,
  required = false,
  autoFocus,
  inputRef,
  inputProps,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const isControlled = valueProp !== undefined
  const [uncontrolled, setUncontrolled] = React.useState(
    () => sanitize(defaultValue, length, validationType, normalizeValue)[0]
  )
  const value = isControlled ? valueProp.slice(0, length) : uncontrolled
  const valueRef = React.useRef(value)
  valueRef.current = value
  const [focused, setFocused] = React.useState(false)
  const hiddenInputRef = React.useRef<TextInput>(null)

  const composedInputRef = useComposedRefs(hiddenInputRef, inputRef)

  const focusInput = React.useCallback(() => {
    hiddenInputRef.current?.focus()
  }, [])

  const handleChangeText = useEffectEvent(
    (text: string, event?: ChangeEvent) => {
      const previous = valueRef.current
      const [next, rejected] = sanitize(
        text,
        length,
        validationType,
        normalizeValue
      )
      const pasted = text.length - previous.length > 1
      const inputReason = pasted
        ? OTP_FIELD_REASONS.inputPaste
        : OTP_FIELD_REASONS.inputChange
      if (rejected) {
        onValueInvalid?.(text, createGenericEventDetails(inputReason, event))
      }
      if (next === previous) return
      const reason = next === "" ? OTP_FIELD_REASONS.inputClear : inputReason
      const details = createChangeEventDetails(reason, event)
      onValueChange?.(next, details)
      if (details.isCanceled) return
      valueRef.current = next
      if (!isControlled) setUncontrolled(next)
      if (next.length === length && previous.length !== length) {
        onValueComplete?.(next, createGenericEventDetails(inputReason, event))
      }
    }
  )

  const complete = value.length === length

  const state = React.useMemo<RootState>(
    () => ({ complete, disabled, focused, length, readOnly, required, value }),
    [complete, disabled, focused, length, readOnly, required, value]
  )

  const slots = React.useMemo<readonly Slot[]>(() => {
    const activeIndex = focused ? Math.min(value.length, length - 1) : -1
    return Array.from({ length }, (_, index) => {
      const character = value[index] ?? ""
      return {
        char: character && mask ? "•" : character,
        filled: character !== "",
        isActive: index === activeIndex,
        hasFakeCaret: focused && index === value.length && !readOnly,
      }
    })
  }, [focused, value, length, mask, readOnly])

  const context = React.useMemo<RootContextValue>(
    () => ({ state, slots, focusInput }),
    [state, slots, focusInput]
  )

  const { onFocus, onBlur, ...restInputProps } = inputProps ?? {}

  const hiddenInput = (
    <TextInput
      key="otp-field-input"
      autoComplete="one-time-code"
      textContentType="oneTimeCode"
      keyboardType={validationType === "numeric" ? "number-pad" : "default"}
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      caretHidden
      selectionColor="transparent"
      underlineColorAndroid="transparent"
      autoFocus={autoFocus}
      accessibilityLabel={`${length} character code`}
      accessibilityState={{ disabled }}
      {...restInputProps}
      ref={composedInputRef}
      value={value}
      editable={!disabled && !readOnly}
      selection={{ start: value.length, end: value.length }}
      onChangeText={(text) => handleChangeText(text)}
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      style={styles.input}
    />
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        children: (
          <>
            {children}
            {hiddenInput}
          </>
        ),
      },
      elementProps,
    ],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "OTPFieldRoot"

function Input({
  index,
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: InputProps) {
  const { state: rootState } = useRootContext()
  const slot = useSlot(index)

  const state = React.useMemo<InputState>(
    () => ({
      ...rootState,
      value: slot.char,
      index,
      filled: slot.filled,
      active: slot.isActive,
      caret: slot.hasFakeCaret,
    }),
    [rootState, slot, index]
  )

  let content = typeof children === "function" ? children(slot) : children
  if (children === undefined) content = <Text>{slot.char}</Text>

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
        children: content,
      },
      elementProps,
    ],
  })
}

Input.displayName = "OTPFieldInput"

function Separator({
  render,
  className,
  style,
  ref,
  ...elementProps
}: SeparatorProps) {
  const { state } = useRootContext()
  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [
      {
        accessibilityElementsHidden: true,
        importantForAccessibility: "no-hide-descendants",
      },
      elementProps,
    ],
  })
}

Separator.displayName = "OTPFieldSeparator"

export type {
  ChangeEventDetails,
  ChangeEventReason,
  CompleteEventDetails,
  CompleteEventReason,
  HiddenInputProps,
  InputProps,
  InputState,
  InvalidEventDetails,
  InvalidEventReason,
  RootContextValue,
  RootProps,
  RootState,
  SeparatorProps,
  SeparatorState,
  Slot,
  ValidationType,
}
export { Input, OTP_FIELD_REASONS, Root, Separator, useRootContext, useSlot }
