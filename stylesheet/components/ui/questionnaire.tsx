import { CheckIcon } from "phosphor-react-native"
import * as React from "react"
import {
  type GestureResponderEvent,
  I18nManager,
  Pressable,
  type PressableStateCallbackType,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native"
import Animated, { Keyframe, ReduceMotion } from "react-native-reanimated"
import { useHaptics } from "@/components/primitives/haptics"
import { useEffectEvent } from "@/components/primitives/hooks"
import { Button, type ButtonProps } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { Text, TextStyleContext } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped"

type QuestionnaireItemDefinition = {
  name: string
  required?: boolean
  disabled?: boolean
}

type QuestionnaireValues = Record<string, string | string[]>

type QuestionnaireState = {
  current: number
  first: boolean
  last: boolean
  total: number
}

type QuestionnaireDirection = "forward" | "backward"

type QuestionnaireAnswer = { choices: string[]; text: string }

type ItemRecord = {
  name: string
  required: boolean
  disabled: boolean
  invalid: boolean
  multiple: boolean
}

type QuestionnaireInputType =
  | "text"
  | "email"
  | "number"
  | "tel"
  | "url"
  | "password"
  | "search"

type QuestionnaireContextValue = QuestionnaireState & {
  activeItemName: string | null
  activeItemRequired: boolean | null
  shownItemName: string | null
  direction: QuestionnaireDirection
  animated: boolean
  values: QuestionnaireValues
  goNext: () => void
  goPrevious: () => void
  skipCurrent: () => void
  submit: () => void
  reset: () => void
  registerItem: (record: ItemRecord) => () => void
  updateItem: (record: ItemRecord) => void
  answerOf: (name: string) => QuestionnaireAnswer
  statusOf: (name: string) => QuestionnaireItemStatus
  invalidOf: (name: string) => boolean
  requiredOf: (name: string) => boolean
  select: (
    name: string,
    value: string,
    selected: boolean,
    multiple: boolean
  ) => void
  setText: (name: string, text: string) => void
  setDefault: (
    name: string,
    answer: { choice?: string; text?: string },
    on: boolean
  ) => void
}

type QuestionnaireItemContextValue = {
  name: string
  multiple: boolean
  required: boolean
  disabled: boolean
  invalid: boolean
  status: QuestionnaireItemStatus
  answer: QuestionnaireAnswer
  titleId: string
}

type UseQuestionnaireParameters = {
  defaultItem?: string
  item?: string
  items?: readonly QuestionnaireItemDefinition[]
  onItemChange?: (item: string) => void
  onSubmit?: (values: QuestionnaireValues) => void
}

const EMPTY: QuestionnaireAnswer = { choices: [], text: "" }

const SHIFT = I18nManager.isRTL ? -48 : 48

const EASING_DURATION = 280

function slideIn(from: number) {
  return new Keyframe({
    0: { opacity: 0, transform: [{ translateX: from }] },
    100: { opacity: 1, transform: [{ translateX: 0 }] },
  })
    .duration(EASING_DURATION)
    .reduceMotion(ReduceMotion.System)
}

function slideOut(to: number) {
  return new Keyframe({
    0: { opacity: 1, transform: [{ translateX: 0 }] },
    100: { opacity: 0, transform: [{ translateX: to }] },
  })
    .duration(200)
    .reduceMotion(ReduceMotion.System)
}

const TRANSITIONS = {
  forward: { entering: slideIn(SHIFT), exiting: slideOut(-SHIFT) },
  backward: { entering: slideIn(-SHIFT), exiting: slideOut(SHIFT) },
}

const QuestionnaireContext =
  React.createContext<QuestionnaireContextValue | null>(null)

const QuestionnaireItemContext =
  React.createContext<QuestionnaireItemContextValue | null>(null)

function useQuestionnaireContext(component = "useQuestionnaireContext") {
  const context = React.useContext(QuestionnaireContext)
  if (!context) {
    throw new Error(`${component} must be used within a <Questionnaire />`)
  }
  return context
}

function useQuestionnaireItemContext(component: string) {
  const context = React.useContext(QuestionnaireItemContext)
  if (!context) {
    throw new Error(`${component} must be used within a <QuestionnaireItem />`)
  }
  return context
}

function hasAnswer(answer: QuestionnaireAnswer) {
  return answer.choices.length > 0 || answer.text.trim().length > 0
}

function wrapText(children: React.ReactNode, style?: StyleProp<TextStyle>) {
  if (typeof children === "string" || typeof children === "number") {
    return <Text style={style}>{children}</Text>
  }
  return children
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  root: { width: "100%", minWidth: 0, flexDirection: "column", gap: 24 },
  progress: { minHeight: 16, alignSelf: "flex-start" },
  progressText: { ...fontSize.xs, fontVariant: ["tabular-nums"] },
  item: { minWidth: 0, flexDirection: "column", gap: 20 },
  hidden: { display: "none" },
  title: { ...fontSize.base, fontWeight: "600" },
  description: { ...fontSize.sm, marginTop: -14 },
  choices: { minWidth: 0, gap: 12 },
  choice: {
    position: "relative",
    minHeight: 44,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    borderRadius: radius.xl,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  choiceChecked: {
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 11,
  },
  indicator: {
    marginTop: 4,
    width: 16,
    height: 16,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  dot: { width: 8, height: 8, borderRadius: radius.full },
  dotDark: { width: 10, height: 10 },
  label: { minWidth: 0, flex: 1, gap: 4 },
  error: { ...fontSize.sm },
  actions: {
    minHeight: 44,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
  navigation: { minHeight: 44 },
  previous: { marginEnd: "auto" },
})

function useQuestionnaire({
  defaultItem,
  item,
  items,
  onItemChange,
  onSubmit,
}: UseQuestionnaireParameters) {
  const [records, setRecords] = React.useState<ItemRecord[]>([])
  const [answers, setAnswers] = React.useState<
    Record<string, QuestionnaireAnswer>
  >({})
  const [defaults, setDefaults] = React.useState<
    Record<string, QuestionnaireAnswer>
  >({})
  const [skipped, setSkipped] = React.useState<Record<string, boolean>>({})
  const [attempted, setAttempted] = React.useState<Record<string, boolean>>({})
  const [uncontrolledItem, setUncontrolledItem] = React.useState<string | null>(
    defaultItem ?? null
  )
  const [submitRequest, setSubmitRequest] = React.useState(0)
  const defaultsRef = React.useRef(defaults)
  defaultsRef.current = defaults

  const controlled = item !== undefined
  const requested = controlled ? item : uncontrolledItem
  const definitionByName = React.useMemo(
    () => new Map((items ?? []).map((entry) => [entry.name, entry])),
    [items]
  )
  const recordByName = React.useMemo(
    () => new Map(records.map((record) => [record.name, record])),
    [records]
  )
  const sequence = React.useMemo(
    () =>
      (items ?? records)
        .filter((entry) => !entry.disabled)
        .map((entry) => entry.name),
    [items, records]
  )
  const activeItemName =
    requested !== null && sequence.includes(requested)
      ? requested
      : (sequence[0] ?? null)
  const index = activeItemName ? sequence.indexOf(activeItemName) : -1
  const total = sequence.length
  const current = index < 0 ? 0 : index + 1
  const first = total > 0 && index === 0
  const last = total > 0 && index === total - 1

  const [shownItemName, setShownItemName] = React.useState(activeItemName)
  const [lastDirection, setLastDirection] =
    React.useState<QuestionnaireDirection>("forward")
  const [animated, setAnimated] = React.useState(false)
  const shownIndex = shownItemName ? sequence.indexOf(shownItemName) : -1
  const direction: QuestionnaireDirection =
    shownItemName !== activeItemName && shownIndex >= 0 && index >= 0
      ? index > shownIndex
        ? "forward"
        : "backward"
      : lastDirection

  React.useLayoutEffect(() => {
    if (shownItemName === activeItemName) return
    setLastDirection(direction)
    setShownItemName(activeItemName)
  }, [shownItemName, activeItemName, direction])

  React.useEffect(() => {
    if (shownItemName !== null && !animated) setAnimated(true)
  }, [shownItemName, animated])

  const answerOf = React.useCallback(
    (name: string) => answers[name] ?? defaults[name] ?? EMPTY,
    [answers, defaults]
  )

  const statusOf = React.useCallback(
    (name: string): QuestionnaireItemStatus => {
      if (skipped[name]) return "skipped"
      return hasAnswer(answerOf(name)) ? "answered" : "unanswered"
    },
    [skipped, answerOf]
  )

  const requiredOf = React.useCallback(
    (name: string) => {
      const definition = definitionByName.get(name)
      if (definition) return !!definition.required
      return recordByName.get(name)?.required ?? false
    },
    [definitionByName, recordByName]
  )

  const satisfied = React.useCallback(
    (name: string) => {
      const record = recordByName.get(name)
      if (!record || record.disabled) return true
      const status = statusOf(name)
      if (status === "skipped" && !requiredOf(name)) return true
      return !record.invalid && status === "answered"
    },
    [recordByName, statusOf, requiredOf]
  )

  const invalidOf = React.useCallback(
    (name: string) => {
      const record = recordByName.get(name)
      if (!record || record.disabled) return false
      if (statusOf(name) === "skipped" && !requiredOf(name)) return false
      return record.invalid || (!!attempted[name] && !satisfied(name))
    },
    [recordByName, statusOf, requiredOf, attempted, satisfied]
  )

  const validate = React.useCallback(
    (name: string) => {
      setAttempted((state) => ({ ...state, [name]: true }))
      return satisfied(name)
    },
    [satisfied]
  )

  const navigate = React.useCallback(
    (name: string) => {
      if (name === activeItemName) return
      if (!controlled) setUncontrolledItem(name)
      onItemChange?.(name)
    },
    [activeItemName, controlled, onItemChange]
  )

  const values = React.useMemo(() => {
    const result: QuestionnaireValues = {}
    for (const name of sequence) {
      if (skipped[name]) continue
      const answer = answers[name] ?? defaults[name] ?? EMPTY
      if (!hasAnswer(answer)) continue
      if (recordByName.get(name)?.multiple) {
        result[name] = answer.text.trim()
          ? [...answer.choices, answer.text]
          : answer.choices
      } else {
        result[name] = answer.choices[0] ?? answer.text
      }
    }
    return result
  }, [sequence, skipped, answers, defaults, recordByName])

  const goPrevious = React.useCallback(() => {
    const previous = sequence[index - 1]
    if (previous) navigate(previous)
  }, [sequence, index, navigate])

  const goNext = React.useCallback(() => {
    const next = sequence[index + 1]
    if (!activeItemName || !next) return
    if (!validate(activeItemName)) return
    navigate(next)
  }, [sequence, index, activeItemName, validate, navigate])

  const submit = React.useCallback(() => {
    const invalid = sequence.find((name) => !validate(name))
    if (invalid) {
      navigate(invalid)
      return
    }
    onSubmit?.(values)
  }, [sequence, validate, navigate, onSubmit, values])

  const runSubmit = useEffectEvent(submit)

  React.useEffect(() => {
    if (submitRequest > 0) runSubmit()
  }, [submitRequest, runSubmit])

  const skipCurrent = React.useCallback(() => {
    if (!activeItemName || requiredOf(activeItemName)) return
    setAnswers((state) => ({ ...state, [activeItemName]: EMPTY }))
    setSkipped((state) => ({ ...state, [activeItemName]: true }))
    if (last) {
      setSubmitRequest((count) => count + 1)
      return
    }
    const next = sequence[index + 1]
    if (next) navigate(next)
  }, [activeItemName, requiredOf, last, sequence, index, navigate])

  const reset = React.useCallback(() => {
    setAnswers({})
    setSkipped({})
    setAttempted({})
    const target =
      defaultItem && sequence.includes(defaultItem) ? defaultItem : sequence[0]
    if (target) navigate(target)
  }, [defaultItem, sequence, navigate])

  const registerItem = React.useCallback((record: ItemRecord) => {
    setRecords((state) => [
      ...state.filter((entry) => entry.name !== record.name),
      record,
    ])
    return () => {
      setRecords((state) => state.filter((entry) => entry.name !== record.name))
    }
  }, [])

  const updateItem = React.useCallback((record: ItemRecord) => {
    setRecords((state) =>
      state.map((entry) => (entry.name === record.name ? record : entry))
    )
  }, [])

  const select = React.useCallback(
    (name: string, value: string, selected: boolean, multiple: boolean) => {
      setSkipped((state) => (state[name] ? { ...state, [name]: false } : state))
      setAnswers((state) => {
        const answer = state[name] ?? defaultsRef.current[name] ?? EMPTY
        const choices = !selected
          ? answer.choices.filter((entry) => entry !== value)
          : multiple
            ? answer.choices.includes(value)
              ? answer.choices
              : [...answer.choices, value]
            : [value]
        return { ...state, [name]: { ...answer, choices } }
      })
    },
    []
  )

  const setText = React.useCallback((name: string, text: string) => {
    if (text.trim()) {
      setSkipped((state) => (state[name] ? { ...state, [name]: false } : state))
    }
    setAnswers((state) => {
      const answer = state[name] ?? defaultsRef.current[name] ?? EMPTY
      return { ...state, [name]: { ...answer, text } }
    })
  }, [])

  const setDefault = React.useCallback(
    (name: string, answer: { choice?: string; text?: string }, on: boolean) => {
      setDefaults((state) => {
        const previous = state[name] ?? EMPTY
        const { choice, text } = answer
        const choices =
          choice === undefined
            ? previous.choices
            : on
              ? previous.choices.includes(choice)
                ? previous.choices
                : [...previous.choices, choice]
              : previous.choices.filter((entry) => entry !== choice)
        const nextText = text === undefined ? previous.text : on ? text : ""
        if (choices === previous.choices && nextText === previous.text) {
          return state
        }
        return { ...state, [name]: { choices, text: nextText } }
      })
    },
    []
  )

  const activeItemRequired =
    activeItemName === null ? null : requiredOf(activeItemName)

  const context = React.useMemo<QuestionnaireContextValue>(
    () => ({
      activeItemName,
      activeItemRequired,
      shownItemName,
      direction,
      animated,
      current,
      first,
      last,
      total,
      values,
      goNext,
      goPrevious,
      skipCurrent,
      submit,
      reset,
      registerItem,
      updateItem,
      answerOf,
      statusOf,
      invalidOf,
      requiredOf,
      select,
      setText,
      setDefault,
    }),
    [
      activeItemName,
      activeItemRequired,
      shownItemName,
      direction,
      animated,
      current,
      first,
      last,
      total,
      values,
      goNext,
      goPrevious,
      skipCurrent,
      submit,
      reset,
      registerItem,
      updateItem,
      answerOf,
      statusOf,
      invalidOf,
      requiredOf,
      select,
      setText,
      setDefault,
    ]
  )

  const state: QuestionnaireState = { current, first, last, total }

  return { context, state }
}

function Questionnaire({
  defaultItem,
  item,
  items,
  onItemChange,
  onSubmit,
  style,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> &
  UseQuestionnaireParameters) {
  const questionnaire = useQuestionnaire({
    defaultItem,
    item,
    items,
    onItemChange,
    onSubmit,
  })
  return (
    <QuestionnaireContext.Provider value={questionnaire.context}>
      <View style={[styles.root, style]} {...props} />
    </QuestionnaireContext.Provider>
  )
}

function QuestionnaireProgress({
  style,
  children,
  ...props
}: Omit<React.ComponentProps<typeof View>, "children"> &
  React.RefAttributes<View> & {
    children?:
      | React.ReactNode
      | ((state: QuestionnaireState) => React.ReactNode)
  }) {
  const { colors } = useTheme()
  const { current, first, last, total } = useQuestionnaireContext(
    "QuestionnaireProgress"
  )
  const text = total ? `Question ${current} of ${total}` : undefined
  const content =
    typeof children === "function"
      ? children({ current, first, last, total })
      : children
  const textStyle = [styles.progressText, { color: colors.labelSecondary }]
  return (
    <View
      role="progressbar"
      accessibilityLabel="Questionnaire progress"
      accessibilityLiveRegion="polite"
      accessibilityValue={
        total ? { min: 1, max: total, now: current, text } : undefined
      }
      style={[styles.progress, style]}
      {...props}
    >
      {content === undefined ? (
        <Text style={textStyle}>{text}</Text>
      ) : (
        wrapText(content, textStyle)
      )}
    </View>
  )
}

function QuestionnaireItem({
  name,
  required = false,
  disabled = false,
  invalid: invalidProp = false,
  multiple = false,
  onStatusChange,
  style,
  children,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    name: string
    required?: boolean
    disabled?: boolean
    invalid?: boolean
    multiple?: boolean
    onStatusChange?: (status: QuestionnaireItemStatus) => void
  }) {
  const root = useQuestionnaireContext("QuestionnaireItem")
  const titleId = React.useId()
  const record = React.useMemo<ItemRecord>(
    () => ({ name, required, disabled, invalid: invalidProp, multiple }),
    [name, required, disabled, invalidProp, multiple]
  )
  const recordRef = React.useRef(record)
  recordRef.current = record
  const { registerItem, updateItem } = root

  React.useLayoutEffect(
    () => registerItem({ ...recordRef.current, name }),
    [name, registerItem]
  )

  React.useLayoutEffect(() => {
    updateItem(record)
  }, [record, updateItem])

  const status = root.statusOf(name)
  const statusRef = React.useRef(status)
  React.useEffect(() => {
    if (statusRef.current === status) return
    statusRef.current = status
    onStatusChange?.(status)
  }, [status, onStatusChange])

  const answer = root.answerOf(name)
  const invalid = root.invalidOf(name)
  const context = React.useMemo<QuestionnaireItemContextValue>(
    () => ({
      name,
      multiple,
      required: root.requiredOf(name),
      disabled,
      invalid,
      status,
      answer,
      titleId,
    }),
    [
      name,
      multiple,
      root.requiredOf,
      disabled,
      invalid,
      status,
      answer,
      titleId,
    ]
  )
  const shown = !disabled && root.shownItemName === name
  const transition = TRANSITIONS[root.direction]

  return (
    <QuestionnaireItemContext.Provider value={context}>
      {shown ? (
        <Animated.View
          key="shown"
          role={multiple ? "group" : "radiogroup"}
          accessibilityLabelledBy={titleId}
          entering={root.animated ? transition.entering : undefined}
          exiting={transition.exiting}
          style={[styles.item, style]}
          {...props}
        >
          {children}
        </Animated.View>
      ) : (
        <View key="hidden" style={styles.hidden}>
          {children}
        </View>
      )}
    </QuestionnaireItemContext.Provider>
  )
}

function QuestionnaireTitle({
  style,
  ...props
}: Omit<React.ComponentProps<typeof Text>, "nativeID"> &
  React.RefAttributes<typeof Text>) {
  const { titleId } = useQuestionnaireItemContext("QuestionnaireTitle")
  return (
    <Text
      role="heading"
      nativeID={titleId}
      style={[styles.title, style]}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  const { colors } = useTheme()
  useQuestionnaireItemContext("QuestionnaireDescription")
  return (
    <Text
      style={[styles.description, { color: colors.labelSecondary }, style]}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  style,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  useQuestionnaireItemContext("QuestionnaireChoices")
  return <View style={[styles.choices, style]} {...props} />
}

function QuestionnaireChoice({
  value,
  checked,
  defaultChecked = false,
  disabled: disabledProp = false,
  onCheckedChange,
  style,
  children,
  onPress,
  ...props
}: Omit<React.ComponentProps<typeof Pressable>, "children" | "style"> &
  React.RefAttributes<View> & {
    value: string
    checked?: boolean
    defaultChecked?: boolean
    disabled?: boolean
    onCheckedChange?: (checked: boolean) => void
    children?: React.ReactNode
    style?:
      | StyleProp<ViewStyle>
      | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
  }) {
  const { colors, isDark } = useTheme()
  const root = useQuestionnaireContext("QuestionnaireChoice")
  const item = useQuestionnaireItemContext("QuestionnaireChoice")
  const haptics = useHaptics()
  const { name, multiple } = item
  const disabled = item.disabled || disabledProp
  const isChecked =
    item.status !== "skipped" && item.answer.choices.includes(value)
  const { select, setDefault } = root

  React.useLayoutEffect(() => {
    if (!defaultChecked) return
    setDefault(name, { choice: value }, true)
    return () => setDefault(name, { choice: value }, false)
  }, [defaultChecked, name, value, setDefault])

  React.useLayoutEffect(() => {
    if (checked === undefined || checked === isChecked) return
    select(name, value, checked, multiple)
  }, [checked, isChecked, name, value, multiple, select])

  const handlePress = (event: GestureResponderEvent) => {
    onPress?.(event)
    if (disabled) return
    const next = multiple ? !isChecked : true
    if (next === isChecked) return
    onCheckedChange?.(next)
    if (checked !== undefined) return
    select(name, value, next, multiple)
    haptics.selection()
  }

  return (
    <Pressable
      role={multiple ? "checkbox" : "radio"}
      accessibilityState={{ checked: isChecked, disabled }}
      disabled={disabled}
      onPress={handlePress}
      style={(state) => [
        styles.choice,
        { borderColor: colors.separator },
        state.pressed && { backgroundColor: colors.itemPressed },
        item.invalid && {
          borderColor: colors.danger,
          backgroundColor: withAlpha(colors.danger, isDark ? 0.1 : 0.05),
        },
        isChecked && [styles.choiceChecked, { borderColor: colors.accent }],
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      <View
        style={[
          styles.indicator,
          {
            borderRadius: multiple ? radius.xs : radius.full,
            backgroundColor: isChecked ? colors.accent : colors.labelQuaternary,
          },
        ]}
      >
        {isChecked ? (
          multiple ? (
            <Icon
              as={CheckIcon}
              weight="bold"
              size={14}
              color={colors.onAccent}
            />
          ) : (
            <View
              style={[
                styles.dot,
                isDark && styles.dotDark,
                { backgroundColor: colors.onAccent },
              ]}
            />
          )
        ) : null}
      </View>
      <TextStyleContext.Provider
        value={{
          ...fontSize.base,
          color: disabled ? colors.labelQuaternary : colors.label,
        }}
      >
        <View style={styles.label}>
          {React.Children.map(children, (child) => wrapText(child))}
        </View>
      </TextStyleContext.Provider>
    </Pressable>
  )
}

function QuestionnaireChoiceDescription({
  style,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  const { colors } = useTheme()
  return <Text style={[{ color: colors.labelSecondary }, style]} {...props} />
}

function inputTypeProps(
  type: QuestionnaireInputType
): Partial<React.ComponentProps<typeof Input>> {
  switch (type) {
    case "email":
      return {
        keyboardType: "email-address",
        autoCapitalize: "none",
        autoComplete: "email",
        textContentType: "emailAddress",
      }
    case "number":
      return { keyboardType: "numeric" }
    case "tel":
      return {
        keyboardType: "phone-pad",
        autoComplete: "tel",
        textContentType: "telephoneNumber",
      }
    case "url":
      return {
        keyboardType: "url",
        autoCapitalize: "none",
        textContentType: "URL",
      }
    case "password":
      return {
        secureTextEntry: true,
        autoCapitalize: "none",
        textContentType: "password",
      }
    case "search":
      return { returnKeyType: "search" }
    default:
      return {}
  }
}

function QuestionnaireInput({
  type = "text",
  value,
  defaultValue,
  onValueChange,
  disabled = false,
  style,
  accessibilityLabel,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "name" | "required"> & {
  type?: QuestionnaireInputType
}) {
  const { colors, isDark } = useTheme()
  const root = useQuestionnaireContext("QuestionnaireInput")
  const item = useQuestionnaireItemContext("QuestionnaireInput")
  const { name } = item
  const { setText, setDefault } = root

  React.useLayoutEffect(() => {
    if (!defaultValue) return
    setDefault(name, { text: defaultValue }, true)
    return () => setDefault(name, { text: defaultValue }, false)
  }, [defaultValue, name, setDefault])

  React.useLayoutEffect(() => {
    if (value !== undefined) setText(name, value)
  }, [value, name, setText])

  return (
    <Input
      {...inputTypeProps(type)}
      value={value ?? item.answer.text}
      onValueChange={(next, details) => {
        onValueChange?.(next, details)
        if (value === undefined && !details.isCanceled) setText(name, next)
      }}
      disabled={item.disabled || disabled}
      accessibilityLabel={accessibilityLabel}
      accessibilityLabelledBy={
        accessibilityLabel === undefined ? item.titleId : undefined
      }
      style={(state) => [
        item.invalid && {
          borderColor: colors.danger,
          backgroundColor: withAlpha(colors.danger, isDark ? 0.1 : 0.05),
        },
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    />
  )
}

function QuestionnaireError({
  style,
  children,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  const { colors } = useTheme()
  const { invalid, required } =
    useQuestionnaireItemContext("QuestionnaireError")
  if (!invalid) return null
  return (
    <Text
      role="alert"
      accessibilityLiveRegion="polite"
      style={[styles.error, { color: colors.danger }, style]}
      {...props}
    >
      {children ??
        (required
          ? "Choose an answer to continue."
          : "Choose an answer or skip this question.")}
    </Text>
  )
}

function QuestionnaireActions({
  style,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return <View style={[styles.actions, style]} {...props} />
}

type QuestionnaireNavigationProps = Omit<ButtonProps, "children"> & {
  children?: React.ReactNode
}

function NavigationButton({
  visible,
  action,
  label,
  children,
  style,
  onPress,
  ...props
}: QuestionnaireNavigationProps & {
  visible: boolean
  action: () => void
  label: string
}) {
  if (!visible) return null
  return (
    <Button
      style={(state) => [
        styles.navigation,
        typeof style === "function" ? style(state) : style,
      ]}
      onPress={(event) => {
        onPress?.(event)
        action()
      }}
      {...props}
    >
      {wrapText(children ?? label)}
    </Button>
  )
}

function QuestionnairePrevious({
  variant = "outline",
  style,
  ...props
}: QuestionnaireNavigationProps) {
  const { first, total, goPrevious } = useQuestionnaireContext(
    "QuestionnairePrevious"
  )
  return (
    <NavigationButton
      variant={variant}
      style={(state) => [
        styles.previous,
        typeof style === "function" ? style(state) : style,
      ]}
      visible={total > 1 && !first}
      action={goPrevious}
      label="Previous"
      {...props}
    />
  )
}
function QuestionnaireSkip({
  variant = "outline",
  ...props
}: QuestionnaireNavigationProps) {
  const { activeItemRequired, skipCurrent } =
    useQuestionnaireContext("QuestionnaireSkip")
  return (
    <NavigationButton
      variant={variant}
      visible={activeItemRequired === false}
      action={skipCurrent}
      label="Skip"
      {...props}
    />
  )
}

function QuestionnaireNext({
  variant = "default",
  ...props
}: QuestionnaireNavigationProps) {
  const { last, total, goNext } = useQuestionnaireContext("QuestionnaireNext")
  return (
    <NavigationButton
      variant={variant}
      visible={total > 1 && !last}
      action={goNext}
      label="Next"
      {...props}
    />
  )
}

function QuestionnaireSubmit({
  variant = "default",
  ...props
}: QuestionnaireNavigationProps) {
  const { last, total, submit } = useQuestionnaireContext("QuestionnaireSubmit")
  return (
    <NavigationButton
      variant={variant}
      visible={total > 0 && last}
      action={submit}
      label="Submit"
      {...props}
    />
  )
}

export type {
  QuestionnaireItemDefinition,
  QuestionnaireItemStatus,
  QuestionnaireState,
  QuestionnaireValues,
}
export {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
  useQuestionnaire,
  useQuestionnaireContext,
}
