import { CaretDownIcon, CaretUpIcon } from "phosphor-react-native"
import * as React from "react"
import {
  InputAccessoryView,
  Keyboard,
  Platform,
  type StyleProp,
  StyleSheet,
  type TextInput,
  type TextInputProps,
  View,
  type ViewStyle,
} from "react-native"
import { useComposedRefs } from "@/components/primitives/hooks"
import {
  setKeyboardAccessoryHeight,
  useKeyboard,
} from "@/components/primitives/keyboard"
import { Portal } from "@/components/primitives/portal"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { KeyboardScrollViewContext } from "@/components/ui/keyboard-scroll-view"
import { Text } from "@/components/ui/text"
import { useTheme } from "@/components/ui/theme"

type InputRef = React.RefObject<TextInput | null>

type FocusEvent = Parameters<NonNullable<TextInputProps["onFocus"]>>[0]

type BlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0]

type SubmitEvent = Parameters<NonNullable<TextInputProps["onSubmitEditing"]>>[0]

type InputAccessoryBarContextValue = {
  nativeID: string
  inputs: readonly InputRef[]
  focused: InputRef | null
  register: (input: InputRef) => () => void
  setFocused: (input: InputRef | null) => void
  focusAt: (index: number) => void
  done: () => void
}

const InputAccessoryBarContext =
  React.createContext<InputAccessoryBarContextValue | null>(null)

function useInputAccessoryBarContext() {
  const context = React.useContext(InputAccessoryBarContext)
  if (!context) {
    throw new Error(
      "useInputAccessoryBarInput must be used within an <InputAccessoryBar />"
    )
  }
  return context
}

const BAR_HEIGHT = 44

const styles = StyleSheet.create({
  bar: {
    height: BAR_HEIGHT,
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingHorizontal: 4,
  },
  spacer: { flex: 1 },
  done: { fontWeight: "600" },
  overlay: { position: "absolute", left: 0, right: 0, zIndex: 50 },
})

function InputAccessoryBarView({
  previousLabel,
  nextLabel,
  doneLabel,
  style,
}: {
  previousLabel: string
  nextLabel: string
  doneLabel: React.ReactNode
  style?: StyleProp<ViewStyle>
}) {
  const { colors, isDark } = useTheme()
  const { inputs, focused, focusAt, done } = useInputAccessoryBarContext()
  const index = focused ? inputs.indexOf(focused) : -1
  return (
    <View
      style={[
        styles.bar,
        {
          borderColor: colors.separator,
          backgroundColor: isDark
            ? colors.surfaceSecondary
            : colors.surfaceRaised,
        },
        style,
      ]}
    >
      <Button
        variant="ghost"
        size="icon"
        accessibilityLabel={previousLabel}
        disabled={index <= 0}
        onPress={() => focusAt(index - 1)}
      >
        <Icon as={CaretUpIcon} size={20} />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        accessibilityLabel={nextLabel}
        disabled={index < 0 || index >= inputs.length - 1}
        onPress={() => focusAt(index + 1)}
      >
        <Icon as={CaretDownIcon} size={20} />
      </Button>
      <View style={styles.spacer} />
      <Button variant="plain" onPress={done}>
        {typeof doneLabel === "string" || typeof doneLabel === "number" ? (
          <Text style={styles.done}>{doneLabel}</Text>
        ) : (
          doneLabel
        )}
      </Button>
    </View>
  )
}

function InputAccessoryBar({
  previousLabel = "Previous",
  nextLabel = "Next",
  doneLabel = "Done",
  onDone,
  portalHost,
  style,
  children,
}: {
  previousLabel?: string
  nextLabel?: string
  doneLabel?: React.ReactNode
  onDone?: () => void
  portalHost?: string
  style?: StyleProp<ViewStyle>
  children?: React.ReactNode
}) {
  const nativeID = `input-accessory-bar-${React.useId()}`
  const [inputs, setInputs] = React.useState<readonly InputRef[]>([])
  const [focused, setFocused] = React.useState<InputRef | null>(null)
  const keyboard = useKeyboard()
  const visible =
    Platform.OS !== "ios" && focused !== null && keyboard.height > 0

  const register = React.useCallback((input: InputRef) => {
    setInputs((current) => [...current, input])
    return () => {
      setInputs((current) => current.filter((entry) => entry !== input))
      setFocused((current) => (current === input ? null : current))
    }
  }, [])

  const focusAt = React.useCallback(
    (index: number) => {
      inputs[index]?.current?.focus()
    },
    [inputs]
  )

  const done = React.useCallback(() => {
    Keyboard.dismiss()
    onDone?.()
  }, [onDone])

  React.useEffect(() => {
    if (Platform.OS === "ios") return
    setKeyboardAccessoryHeight(visible ? BAR_HEIGHT : 0)
  }, [visible])

  React.useEffect(
    () => () => {
      if (Platform.OS !== "ios") setKeyboardAccessoryHeight(0)
    },
    []
  )

  const context = React.useMemo(
    () => ({
      nativeID,
      inputs,
      focused,
      register,
      setFocused,
      focusAt,
      done,
    }),
    [nativeID, inputs, focused, register, focusAt, done]
  )

  const bar = (
    <InputAccessoryBarView
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      doneLabel={doneLabel}
      style={style}
    />
  )

  return (
    <InputAccessoryBarContext.Provider value={context}>
      {children}
      {Platform.OS === "ios" ? (
        <InputAccessoryView nativeID={nativeID}>{bar}</InputAccessoryView>
      ) : (
        <Portal name={nativeID} hostName={portalHost}>
          {visible ? (
            <InputAccessoryBarContext.Provider value={context}>
              <View
                style={[
                  styles.overlay,
                  { bottom: keyboard.height - keyboard.accessoryHeight },
                ]}
              >
                {bar}
              </View>
            </InputAccessoryBarContext.Provider>
          ) : null}
        </Portal>
      )}
    </InputAccessoryBarContext.Provider>
  )
}

function useInputAccessoryBarInput({
  ref,
  onFocus,
  onBlur,
  onSubmitEditing,
}: {
  ref?: React.Ref<TextInput>
  onFocus?: TextInputProps["onFocus"]
  onBlur?: TextInputProps["onBlur"]
  onSubmitEditing?: TextInputProps["onSubmitEditing"]
} = {}) {
  const { nativeID, inputs, register, setFocused, focusAt, done } =
    useInputAccessoryBarContext()
  const scrollView = React.useContext(KeyboardScrollViewContext)
  const inputRef = React.useRef<TextInput>(null)
  const composedRef = useComposedRefs(ref, inputRef)

  React.useEffect(() => register(inputRef), [register])

  const index = inputs.indexOf(inputRef)
  const last = index === inputs.length - 1

  return {
    ref: composedRef,
    inputAccessoryViewID: nativeID,
    returnKeyType: last ? "done" : "next",
    submitBehavior: last ? "blurAndSubmit" : "submit",
    onFocus: (event: FocusEvent) => {
      setFocused(inputRef)
      if (scrollView) setTimeout(scrollView.scrollToFocused, 50)
      onFocus?.(event)
    },
    onBlur: (event: BlurEvent) => {
      setFocused(null)
      onBlur?.(event)
    },
    onSubmitEditing: (event: SubmitEvent) => {
      if (last) done()
      else focusAt(index + 1)
      onSubmitEditing?.(event)
    },
  } satisfies TextInputProps & { ref: React.Ref<TextInput> }
}

function InputAccessoryBarInput({
  ref,
  onFocus,
  onBlur,
  onSubmitEditing,
  ...props
}: React.ComponentProps<typeof Input>) {
  const accessory = useInputAccessoryBarInput({
    ref,
    onFocus,
    onBlur,
    onSubmitEditing,
  })
  return (
    <Input
      returnKeyType={accessory.returnKeyType}
      submitBehavior={accessory.submitBehavior}
      {...props}
      ref={accessory.ref}
      inputAccessoryViewID={accessory.inputAccessoryViewID}
      onFocus={accessory.onFocus}
      onBlur={accessory.onBlur}
      onSubmitEditing={accessory.onSubmitEditing}
    />
  )
}

export { InputAccessoryBar, InputAccessoryBarInput, useInputAccessoryBarInput }
