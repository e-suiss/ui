import * as React from "react"
import {
  AccessibilityInfo,
  Text as RNText,
  TextInput,
  View,
} from "react-native"
import { createChangeEventDetails, REASONS } from "./event-details"
import { useFieldsetContext } from "./fieldset"
import {
  type Values as FormValues,
  useFormContext,
  type ValidationMode,
} from "./form"
import { useEffectEvent } from "./hooks"
import type { BaseUIChangeEventDetails, BaseUIComponentProps } from "./types"
import { useControllableState } from "./use-controllable-state"
import { useRender } from "./use-render"

type TextInputProps = React.ComponentProps<typeof TextInput>

type TextInputChangeEvent = Parameters<
  NonNullable<TextInputProps["onChange"]>
>[0]

type TextInputFocusEvent = Parameters<NonNullable<TextInputProps["onFocus"]>>[0]

type TextInputBlurEvent = Parameters<NonNullable<TextInputProps["onBlur"]>>[0]

interface ValidityState {
  valueMissing: boolean
  tooShort: boolean
  tooLong: boolean
  customError: boolean
  valid: boolean | null
}

interface ValidityData {
  state: ValidityState
  error: string
  errors: string[]
  value: unknown
  initialValue: unknown
}

interface RootState {
  disabled: boolean
  touched: boolean
  dirty: boolean
  valid: boolean | null
  invalid: boolean
  filled: boolean
  focused: boolean
}

type LabelState = RootState

type DescriptionState = RootState

type ErrorState = RootState

type ControlState = RootState

type ValidateResult = string | string[] | null | undefined

type ValidateFunction = (
  value: unknown,
  formValues: FormValues
) => ValidateResult | Promise<ValidateResult>

interface Actions {
  validate: () => void
}

type ValidityKey = Exclude<keyof ValidityState, "valid">

interface ValidationMessages {
  valueMissing: string
  tooShort: (minLength: number) => string
  tooLong: (maxLength: number) => string
}

type RootProps = BaseUIComponentProps<typeof View, RootState> & {
  name?: string | undefined
  disabled?: boolean | undefined
  invalid?: boolean | undefined
  dirty?: boolean | undefined
  touched?: boolean | undefined
  validate?: ValidateFunction | undefined
  validationMode?: ValidationMode | undefined
  validationDebounceTime?: number | undefined
  validationMessages?: Partial<ValidationMessages> | undefined
  actionsRef?: React.RefObject<Actions | null> | undefined
}

type LabelProps = BaseUIComponentProps<typeof RNText, LabelState>

type DescriptionProps = BaseUIComponentProps<typeof RNText, DescriptionState>

type ErrorProps = BaseUIComponentProps<typeof RNText, ErrorState> & {
  match?: boolean | ValidityKey | undefined
}

type ControlChangeEventReason = typeof REASONS.none

type ControlChangeEventDetails =
  BaseUIChangeEventDetails<ControlChangeEventReason>

type ControlProps = Omit<
  BaseUIComponentProps<typeof TextInput, ControlState>,
  "value" | "defaultValue"
> & {
  value?: string | undefined
  defaultValue?: string | undefined
  onValueChange?:
    | ((value: string, eventDetails: ControlChangeEventDetails) => void)
    | undefined
  name?: string | undefined
  disabled?: boolean | undefined
  required?: boolean | undefined
  minLength?: number | undefined
}

interface ValidityProps {
  children: (state: ValidityRenderState) => React.ReactNode
}

interface ValidityRenderState extends Omit<ValidityData, "state"> {
  validity: ValidityState
}

interface ControlRegistration {
  getName: () => string | undefined
  getValue: () => unknown
  initialValue: unknown
  focus: () => void
  required: boolean
  minLength: number | undefined
  maxLength: number | undefined
}

interface Note {
  kind: "description" | "error"
  text: string
}

interface RootContextValue {
  hasRoot: boolean
  state: RootState
  controlId: string
  labelId: string
  labelText: string | undefined
  hint: string | undefined
  validity: ValidityData
  setLabelText: (text: string | undefined) => void
  setNote: (id: string, note: Note | undefined) => void
  registerControl: (
    registration: React.RefObject<ControlRegistration>
  ) => () => void
  setFocused: (focused: boolean) => void
  syncValue: (value: unknown) => void
  onControlChange: (value: unknown) => void
  onControlBlur: () => void
  focusControl: () => void
}

const DEFAULT_MESSAGES: ValidationMessages = {
  valueMissing: "This field is required.",
  tooShort: (minLength) => `Use at least ${minLength} characters.`,
  tooLong: (maxLength) => `Use at most ${maxLength} characters.`,
}

const INITIAL_VALIDITY_STATE: ValidityState = {
  valueMissing: false,
  tooShort: false,
  tooLong: false,
  customError: false,
  valid: null,
}

const INITIAL_VALIDITY: ValidityData = {
  state: INITIAL_VALIDITY_STATE,
  error: "",
  errors: [],
  value: undefined,
  initialValue: undefined,
}

const DEFAULT_STATE: RootState = {
  disabled: false,
  touched: false,
  dirty: false,
  valid: null,
  invalid: false,
  filled: false,
  focused: false,
}

const noop = () => {}

const FALLBACK_CONTEXT: RootContextValue = {
  hasRoot: false,
  state: DEFAULT_STATE,
  controlId: "",
  labelId: "",
  labelText: undefined,
  hint: undefined,
  validity: INITIAL_VALIDITY,
  setLabelText: noop,
  setNote: noop,
  registerControl: () => noop,
  setFocused: noop,
  syncValue: noop,
  onControlChange: noop,
  onControlBlur: noop,
  focusControl: noop,
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useFieldRootContext() {
  return React.useContext(RootContext) ?? FALLBACK_CONTEXT
}

function getText(node: React.ReactNode): string {
  if (node == null || typeof node === "boolean") return ""
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(getText).join("")
  if (React.isValidElement<{ children?: React.ReactNode }>(node)) {
    return getText(node.props.children)
  }
  return ""
}

function toText(value: unknown) {
  if (value == null) return ""
  if (Array.isArray(value)) return value.length > 0 ? "filled" : ""
  return String(value)
}

function toMessages(result: ValidateResult): string[] {
  if (!result) return []
  if (Array.isArray(result)) return result.filter(Boolean)
  return [result]
}

function isPromise(
  value: ValidateResult | Promise<ValidateResult>
): value is Promise<ValidateResult> {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Promise<ValidateResult>).then === "function"
  )
}

function Root({
  name,
  disabled: disabledProp = false,
  invalid: invalidProp,
  dirty: dirtyProp,
  touched: touchedProp,
  validate: validateProp,
  validationMode: validationModeProp,
  validationDebounceTime = 0,
  validationMessages,
  actionsRef,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const fieldset = useFieldsetContext()
  const form = useFormContext()
  const controlId = React.useId()
  const labelId = React.useId()
  const controlRef = React.useRef<React.RefObject<ControlRegistration> | null>(
    null
  )
  const validationIdRef = React.useRef(0)
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const [focused, setFocused] = React.useState(false)
  const [touchedState, setTouched] = React.useState(false)
  const [dirtyState, setDirty] = React.useState(false)
  const [filled, setFilled] = React.useState(false)
  const [labelText, setLabelTextState] = React.useState<string | undefined>()
  const [notes, setNotes] = React.useState<Record<string, Note>>({})
  const [validity, setValidity] = React.useState<ValidityData>(INITIAL_VALIDITY)

  const disabled = disabledProp || (fieldset?.state.disabled ?? false)
  const touched = touchedProp ?? touchedState
  const dirty = dirtyProp ?? dirtyState
  const validationMode =
    validationModeProp ?? form?.validationMode ?? "onSubmit"

  const getName = useEffectEvent(
    () => name ?? controlRef.current?.current.getName()
  )

  const formErrorEntry = name !== undefined ? form?.errors[name] : undefined
  const formErrors = React.useMemo(
    () => toMessages(formErrorEntry),
    [formErrorEntry]
  )

  const errors = React.useMemo(
    () => [...validity.errors, ...formErrors],
    [validity.errors, formErrors]
  )

  const invalid =
    invalidProp ?? (formErrors.length > 0 || validity.state.valid === false)
  const valid =
    invalidProp !== undefined
      ? !invalidProp
      : formErrors.length > 0
        ? false
        : validity.state.valid

  const runValidation = useEffectEvent((value: unknown) => {
    const control = controlRef.current?.current
    const messages = { ...DEFAULT_MESSAGES, ...validationMessages }
    const text = toText(value)
    const required = control?.required ?? false
    const minLength = control?.minLength
    const maxLength = control?.maxLength
    const nextState: ValidityState = {
      valueMissing: required && text.length === 0,
      tooShort:
        minLength !== undefined && text.length > 0 && text.length < minLength,
      tooLong: maxLength !== undefined && text.length > maxLength,
      customError: false,
      valid: true,
    }
    const builtIn: string[] = []
    if (nextState.valueMissing) builtIn.push(messages.valueMissing)
    if (nextState.tooShort && minLength !== undefined) {
      builtIn.push(messages.tooShort(minLength))
    }
    if (nextState.tooLong && maxLength !== undefined) {
      builtIn.push(messages.tooLong(maxLength))
    }

    const validationId = validationIdRef.current + 1
    validationIdRef.current = validationId

    const apply = (custom: string[]) => {
      if (validationId !== validationIdRef.current) return
      const nextErrors = [...builtIn, ...custom]
      setValidity({
        state: {
          ...nextState,
          customError: custom.length > 0,
          valid: nextErrors.length === 0,
        },
        error: nextErrors[0] ?? "",
        errors: nextErrors,
        value,
        initialValue: control?.initialValue,
      })
    }

    if (builtIn.length > 0 || !validateProp) {
      apply([])
      return builtIn.length === 0
    }

    const result = validateProp(value, form?.getValues() ?? {})
    if (isPromise(result)) {
      result.then(
        (resolved) => apply(toMessages(resolved)),
        () => apply([])
      )
      return true
    }
    const custom = toMessages(result)
    apply(custom)
    return custom.length === 0
  })

  const validateCurrent = useEffectEvent(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    return runValidation(controlRef.current?.current.getValue())
  })

  const focusControl = useEffectEvent(() => {
    if (disabled) return
    controlRef.current?.current.focus()
  })

  React.useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    },
    []
  )

  const register = form?.register
  React.useEffect(() => {
    if (!register) return
    return register({
      getName,
      getValue: () => controlRef.current?.current.getValue(),
      validate: validateCurrent,
      focus: focusControl,
    })
  }, [register, getName, validateCurrent, focusControl])

  React.useImperativeHandle(actionsRef, () => ({ validate: validateCurrent }), [
    validateCurrent,
  ])

  const registerControl = React.useCallback(
    (registration: React.RefObject<ControlRegistration>) => {
      controlRef.current = registration
      return () => {
        if (controlRef.current === registration) controlRef.current = null
      }
    },
    []
  )

  const syncValue = useEffectEvent((value: unknown) => {
    const control = controlRef.current?.current
    setFilled(toText(value).length > 0)
    setDirty(control ? !Object.is(value, control.initialValue) : false)
  })

  const onControlChange = useEffectEvent((value: unknown) => {
    form?.clearErrors(getName())
    const shouldValidate =
      validationMode === "onChange" || validity.state.valid !== null
    if (!shouldValidate) return
    if (validationMode === "onChange" && validationDebounceTime > 0) {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(
        () => runValidation(value),
        validationDebounceTime
      )
      return
    }
    runValidation(value)
  })

  const onControlBlur = useEffectEvent(() => {
    setFocused(false)
    setTouched(true)
    if (validationMode === "onBlur") validateCurrent()
  })

  const setLabelText = React.useCallback((text: string | undefined) => {
    setLabelTextState(text)
  }, [])

  const setNote = React.useCallback((id: string, note: Note | undefined) => {
    setNotes((previous) => {
      const current = previous[id]
      if (!note) {
        if (!current) return previous
        const { [id]: _removed, ...rest } = previous
        return rest
      }
      if (current && current.kind === note.kind && current.text === note.text) {
        return previous
      }
      return { ...previous, [id]: note }
    })
  }, [])

  const hint = React.useMemo(() => {
    const entries = Object.values(notes)
    const ordered = [
      ...entries.filter((note) => note.kind === "description"),
      ...entries.filter((note) => note.kind === "error"),
    ]
    const text = ordered
      .map((note) => note.text)
      .filter(Boolean)
      .join(" ")
    return text.length > 0 ? text : undefined
  }, [notes])

  const state = React.useMemo<RootState>(
    () => ({ disabled, touched, dirty, valid, invalid, filled, focused }),
    [disabled, touched, dirty, valid, invalid, filled, focused]
  )

  const validityData = React.useMemo<ValidityData>(
    () => ({
      ...validity,
      state:
        formErrors.length > 0
          ? { ...validity.state, customError: true, valid: false }
          : validity.state,
      errors,
      error: errors[0] ?? "",
    }),
    [validity, formErrors, errors]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({
      hasRoot: true,
      state,
      controlId,
      labelId,
      labelText,
      hint,
      validity: validityData,
      setLabelText,
      setNote,
      registerControl,
      setFocused,
      syncValue,
      onControlChange,
      onControlBlur,
      focusControl,
    }),
    [
      state,
      controlId,
      labelId,
      labelText,
      hint,
      validityData,
      setLabelText,
      setNote,
      registerControl,
      syncValue,
      onControlChange,
      onControlBlur,
      focusControl,
    ]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [{ accessibilityState: { disabled } }, elementProps],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "FieldRoot"

function Label({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: LabelProps) {
  const field = useFieldRootContext()
  const { setLabelText, focusControl, hasRoot } = field
  const text = getText(children)

  React.useEffect(() => {
    if (!hasRoot) return
    setLabelText(text || undefined)
    return () => setLabelText(undefined)
  }, [hasRoot, text, setLabelText])

  return useRender({
    defaultComponent: RNText,
    render,
    className,
    style,
    state: field.state,
    ref,
    props: [
      {
        nativeID: hasRoot ? field.labelId : undefined,
        onPress: hasRoot ? focusControl : undefined,
        accessibilityState: { disabled: field.state.disabled },
        children,
      },
      elementProps,
    ],
  })
}

Label.displayName = "FieldLabel"

function Description({
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: DescriptionProps) {
  const field = useFieldRootContext()
  const { setNote } = field
  const id = React.useId()
  const text = getText(children)

  React.useEffect(() => {
    if (!text) return
    setNote(id, { kind: "description", text })
    return () => setNote(id, undefined)
  }, [id, text, setNote])

  return useRender({
    defaultComponent: RNText,
    render,
    className,
    style,
    state: field.state,
    ref,
    props: [{ nativeID: id, children }, elementProps],
  })
}

Description.displayName = "FieldDescription"

function ErrorPart({
  match,
  children,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ErrorProps) {
  const field = useFieldRootContext()
  const { setNote } = field
  const id = React.useId()

  const matches =
    match === true
      ? true
      : typeof match === "string"
        ? field.validity.state[match]
        : match === false
          ? false
          : field.state.invalid

  const content =
    children ??
    (field.validity.errors.length > 0
      ? field.validity.errors.join("\n")
      : undefined)
  const text = getText(content)
  const visible = matches && content != null && content !== ""

  React.useEffect(() => {
    if (!visible || !text) return
    AccessibilityInfo.announceForAccessibility(text)
    setNote(id, { kind: "error", text })
    return () => setNote(id, undefined)
  }, [visible, text, id, setNote])

  return useRender({
    defaultComponent: RNText,
    render,
    className,
    style,
    state: field.state,
    ref,
    enabled: visible,
    props: [
      { nativeID: id, accessibilityRole: "alert", children: content },
      elementProps,
    ],
  })
}

ErrorPart.displayName = "FieldError"

function Control({
  value: valueProp,
  defaultValue = "",
  onValueChange,
  name,
  disabled: disabledProp = false,
  required = false,
  minLength,
  maxLength,
  editable,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ControlProps) {
  const field = useFieldRootContext()
  const inputRef = React.useRef<TextInput>(null)
  const [value, setValue] = useControllableState<
    string,
    ControlChangeEventDetails
  >({
    value: valueProp,
    defaultValue,
    onChange: onValueChange,
  })
  const [initialValue] = React.useState(value)
  const [focused, setFocused] = React.useState(false)
  const [touched, setTouched] = React.useState(false)

  const valueRef = React.useRef(value)
  valueRef.current = value

  const registrationRef = React.useRef<ControlRegistration>({
    getName: () => name,
    getValue: () => valueRef.current,
    initialValue,
    focus: () => inputRef.current?.focus(),
    required,
    minLength,
    maxLength,
  })
  registrationRef.current = {
    ...registrationRef.current,
    getName: () => name,
    required,
    minLength,
    maxLength,
  }

  const { registerControl, syncValue } = field

  React.useLayoutEffect(
    () => registerControl(registrationRef),
    [registerControl]
  )

  React.useEffect(() => {
    syncValue(value)
  }, [value, syncValue])

  const disabled = field.state.disabled || disabledProp
  const isEditable = !disabled && editable !== false

  const state = React.useMemo<ControlState>(
    () =>
      field.hasRoot
        ? {
            ...field.state,
            disabled: disabled || editable === false,
            focused,
            filled: value.length > 0,
          }
        : {
            ...DEFAULT_STATE,
            disabled: disabled || editable === false,
            touched,
            dirty: value !== initialValue,
            focused,
            filled: value.length > 0,
          },
    [
      field.hasRoot,
      field.state,
      disabled,
      editable,
      focused,
      touched,
      value,
      initialValue,
    ]
  )

  const onChange = (event: TextInputChangeEvent) => {
    const next = event.nativeEvent.text
    const changed = setValue(
      next,
      createChangeEventDetails(REASONS.none, event, inputRef.current)
    )
    if (changed) field.onControlChange(next)
  }

  const onFocus = (_event: TextInputFocusEvent) => {
    setFocused(true)
    field.setFocused(true)
  }

  const onBlur = (_event: TextInputBlurEvent) => {
    setFocused(false)
    setTouched(true)
    field.onControlBlur()
  }

  return useRender({
    defaultComponent: TextInput,
    render,
    className,
    style,
    state,
    ref: [ref, inputRef],
    props: [
      {
        nativeID: field.hasRoot ? field.controlId : undefined,
        accessibilityLabelledBy:
          field.labelText !== undefined ? field.labelId : undefined,
        accessibilityLabel: field.labelText,
        accessibilityHint: field.hint,
        accessibilityState: { disabled },
        editable: isEditable,
        maxLength,
        value,
        onChange,
        onFocus,
        onBlur,
      },
      elementProps,
    ],
  })
}

Control.displayName = "FieldControl"

function Validity({ children }: ValidityProps) {
  const { validity } = useFieldRootContext()
  const { state, ...rest } = validity
  return <>{children({ ...rest, validity: state })}</>
}

Validity.displayName = "FieldValidity"

export type {
  Actions,
  ControlChangeEventDetails,
  ControlChangeEventReason,
  ControlProps,
  ControlState,
  DescriptionProps,
  DescriptionState,
  ErrorProps,
  ErrorState,
  LabelProps,
  LabelState,
  RootContextValue,
  RootProps,
  RootState,
  ValidateFunction,
  ValidationMessages,
  ValidityData,
  ValidityKey,
  ValidityProps,
  ValidityRenderState,
  ValidityState,
}
export {
  Control,
  Description,
  ErrorPart as Error,
  Label,
  Root,
  useFieldRootContext,
  Validity,
}
