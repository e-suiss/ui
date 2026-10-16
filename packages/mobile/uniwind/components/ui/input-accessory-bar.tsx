import { cn } from "cn"
import { CaretDownIcon, CaretUpIcon } from "phosphor-react-native"
import * as React from "react"
import {
  I18nManager,
  InputAccessoryView,
  Keyboard,
  Platform,
  type TextInput,
  type TextInputProps,
  View,
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

type InputRef = React.RefObject<React.ComponentRef<typeof TextInput> | null>

type InputEntry = { ref: InputRef; order: number | undefined }

type InputPosition = { x: number; y: number }

type FocusEvent = Parameters<NonNullable<TextInputProps["onFocus"]>>[0]

type BlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0]

type SubmitEvent = Parameters<NonNullable<TextInputProps["onSubmitEditing"]>>[0]

type InputAccessoryBarContextValue = {
  nativeID: string
  inputs: readonly InputRef[]
  focused: InputRef | null
  register: (input: InputRef, order?: number) => () => void
  setFocused: React.Dispatch<React.SetStateAction<InputRef | null>>
  measure: () => void
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

function sortInputs(
  entries: readonly InputEntry[],
  positions: ReadonlyMap<InputRef, InputPosition>
) {
  return entries
    .map((entry, index) => ({ entry, index }))
    .sort((a, b) => {
      const aOrder = a.entry.order
      const bOrder = b.entry.order
      if (aOrder !== undefined && bOrder !== undefined && aOrder !== bOrder) {
        return aOrder - bOrder
      }
      const aPosition = positions.get(a.entry.ref)
      const bPosition = positions.get(b.entry.ref)
      if (aPosition && bPosition) {
        if (Math.abs(aPosition.y - bPosition.y) > 1) {
          return aPosition.y - bPosition.y
        }
        if (aPosition.x !== bPosition.x) {
          return I18nManager.isRTL
            ? bPosition.x - aPosition.x
            : aPosition.x - bPosition.x
        }
      }
      return a.index - b.index
    })
    .map(({ entry }) => entry.ref)
}

function InputAccessoryBarView({
  previousLabel,
  nextLabel,
  doneLabel,
  className,
}: {
  previousLabel: string
  nextLabel: string
  doneLabel: React.ReactNode
  className?: string
}) {
  const { inputs, focused, focusAt, done } = useInputAccessoryBarContext()
  const index = focused ? inputs.indexOf(focused) : -1
  return (
    <View
      className={cn(
        "h-11 flex-row items-center border-t border-border bg-card px-1 dark:bg-muted",
        className
      )}
    >
      <Button
        variant="ghost"
        size="icon"
        accessibilityLabel={previousLabel}
        disabled={index <= 0}
        onPress={() => focusAt(index - 1)}
      >
        <Icon as={CaretUpIcon} className="size-5" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        accessibilityLabel={nextLabel}
        disabled={index < 0 || index >= inputs.length - 1}
        onPress={() => focusAt(index + 1)}
      >
        <Icon as={CaretDownIcon} className="size-5" />
      </Button>
      <View className="flex-1" />
      <Button variant="plain" onPress={done}>
        {typeof doneLabel === "string" || typeof doneLabel === "number" ? (
          <Text className="font-semibold">{doneLabel}</Text>
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
  className,
  children,
}: {
  previousLabel?: string
  nextLabel?: string
  doneLabel?: React.ReactNode
  onDone?: () => void
  portalHost?: string
  className?: string
  children?: React.ReactNode
}) {
  const nativeID = `input-accessory-bar-${React.useId()}`
  const [entries, setEntries] = React.useState<readonly InputEntry[]>([])
  const [positions, setPositions] = React.useState<
    ReadonlyMap<InputRef, InputPosition>
  >(() => new Map())
  const entriesRef = React.useRef(entries)
  entriesRef.current = entries
  const inputs = React.useMemo(
    () => sortInputs(entries, positions),
    [entries, positions]
  )
  const [focused, setFocused] = React.useState<InputRef | null>(null)
  const keyboard = useKeyboard()
  const visible =
    Platform.OS !== "ios" && focused !== null && keyboard.height > 0

  const register = React.useCallback((input: InputRef, order?: number) => {
    setEntries((current) => [...current, { ref: input, order }])
    return () => {
      setEntries((current) => current.filter((entry) => entry.ref !== input))
      setFocused((current) => (current === input ? null : current))
    }
  }, [])

  const measure = React.useCallback(() => {
    const list = entriesRef.current
    Promise.all(
      list.map(
        (entry) =>
          new Promise<[InputRef, InputPosition | null]>((resolve) => {
            const node = entry.ref.current
            if (!node) {
              resolve([entry.ref, null])
              return
            }
            node.measureInWindow((x, y) => resolve([entry.ref, { x, y }]))
          })
      )
    ).then((results) => {
      const next = new Map<InputRef, InputPosition>()
      for (const [ref, position] of results) {
        if (position) next.set(ref, position)
      }
      setPositions(next)
    })
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
      measure,
      focusAt,
      done,
    }),
    [nativeID, inputs, focused, register, measure, focusAt, done]
  )

  const bar = (
    <InputAccessoryBarView
      previousLabel={previousLabel}
      nextLabel={nextLabel}
      doneLabel={doneLabel}
      className={className}
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
                className="absolute inset-x-0 z-50"
                style={{ bottom: keyboard.height - keyboard.accessoryHeight }}
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
  order,
  onFocus,
  onBlur,
  onSubmitEditing,
}: {
  ref?: React.Ref<React.ComponentRef<typeof TextInput>>
  order?: number
  onFocus?: TextInputProps["onFocus"]
  onBlur?: TextInputProps["onBlur"]
  onSubmitEditing?: TextInputProps["onSubmitEditing"]
} = {}) {
  const { nativeID, inputs, register, setFocused, measure, focusAt, done } =
    useInputAccessoryBarContext()
  const scrollView = React.useContext(KeyboardScrollViewContext)
  const inputRef = React.useRef<React.ComponentRef<typeof TextInput>>(null)
  const composedRef = useComposedRefs(ref, inputRef)

  React.useEffect(() => register(inputRef, order), [register, order])

  const index = inputs.indexOf(inputRef)
  const last = index === inputs.length - 1

  return {
    ref: composedRef,
    inputAccessoryViewID: nativeID,
    returnKeyType: last ? "done" : "next",
    submitBehavior: last ? "blurAndSubmit" : "submit",
    onFocus: (event: FocusEvent) => {
      setFocused(inputRef)
      measure()
      if (scrollView) setTimeout(scrollView.scrollToFocused, 50)
      onFocus?.(event)
    },
    onBlur: (event: BlurEvent) => {
      setFocused((current) => (current === inputRef ? null : current))
      onBlur?.(event)
    },
    onSubmitEditing: (event: SubmitEvent) => {
      if (last) done()
      else focusAt(index + 1)
      onSubmitEditing?.(event)
    },
  } satisfies TextInputProps & {
    ref: React.Ref<React.ComponentRef<typeof TextInput>>
  }
}

function InputAccessoryBarInput({
  ref,
  order,
  onFocus,
  onBlur,
  onSubmitEditing,
  ...props
}: React.ComponentProps<typeof Input> & { order?: number }) {
  const accessory = useInputAccessoryBarInput({
    ref,
    order,
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
