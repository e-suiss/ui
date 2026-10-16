import * as React from "react"
import { View } from "react-native"
import { createGenericEventDetails, REASONS } from "./event-details"
import { useEffectEvent } from "./hooks"
import type { BaseUIComponentProps, BaseUIGenericEventDetails } from "./types"
import { useRender } from "./use-render"

type ValidationMode = "onSubmit" | "onBlur" | "onChange"

type Values = Record<string, unknown>

type Errors = Record<string, string | string[]>

type SubmitEventReason = typeof REASONS.none

type SubmitEventDetails = BaseUIGenericEventDetails<SubmitEventReason>

interface FieldRegistration {
  getName: () => string | undefined
  getValue: () => unknown
  validate: () => boolean | Promise<boolean>
  focus: () => void
}

interface Actions {
  validate: (fieldName?: string | undefined) => void
  submit: () => void | Promise<void>
}

interface RootState {
  submitAttempted: boolean
}

type RootProps<FormValues extends Values = Values> = BaseUIComponentProps<
  typeof View,
  RootState
> & {
  validationMode?: ValidationMode | undefined
  errors?: Errors | undefined
  onFormSubmit?:
    | ((values: FormValues, eventDetails: SubmitEventDetails) => void)
    | undefined
  actionsRef?: React.RefObject<Actions | null> | undefined
}

interface FormContextValue {
  errors: Errors
  clearErrors: (name: string | undefined) => void
  validationMode: ValidationMode
  submitAttempted: boolean
  register: (field: FieldRegistration) => () => void
  getValues: () => Values
  submit: () => void | Promise<void>
  validate: (fieldName?: string | undefined) => void
}

const FormContext = React.createContext<FormContextValue | null>(null)

const EMPTY_ERRORS: Errors = {}

function useFormContext() {
  return React.useContext(FormContext)
}

function Root<FormValues extends Values = Values>({
  validationMode = "onSubmit",
  errors: errorsProp,
  onFormSubmit,
  actionsRef,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps<FormValues>) {
  const fieldsRef = React.useRef(new Set<FieldRegistration>())
  const submitIdRef = React.useRef(0)
  const [submitAttempted, setSubmitAttempted] = React.useState(false)
  const [errors, setErrors] = React.useState<Errors>(errorsProp ?? EMPTY_ERRORS)
  const [previousErrorsProp, setPreviousErrorsProp] = React.useState(errorsProp)

  if (errorsProp !== previousErrorsProp) {
    setPreviousErrorsProp(errorsProp)
    setErrors(errorsProp ?? EMPTY_ERRORS)
  }

  const register = React.useCallback((field: FieldRegistration) => {
    fieldsRef.current.add(field)
    return () => {
      fieldsRef.current.delete(field)
    }
  }, [])

  const clearErrors = React.useCallback((name: string | undefined) => {
    if (name === undefined) return
    setErrors((previous) => {
      if (!(name in previous)) return previous
      const { [name]: _removed, ...rest } = previous
      return rest
    })
  }, [])

  const getValues = React.useCallback(() => {
    const values: Values = {}
    for (const field of fieldsRef.current) {
      const name = field.getName()
      if (name !== undefined) values[name] = field.getValue()
    }
    return values
  }, [])

  const validate = useEffectEvent((fieldName?: string | undefined) => {
    for (const field of fieldsRef.current) {
      if (fieldName === undefined || field.getName() === fieldName) {
        field.validate()
      }
    }
  })

  const submit = useEffectEvent((): void | Promise<void> => {
    setSubmitAttempted(true)
    const submitId = submitIdRef.current + 1
    submitIdRef.current = submitId
    const fields = [...fieldsRef.current]
    const results = fields.map((field) => field.validate())
    const finish = (valid: readonly boolean[]) => {
      if (submitId !== submitIdRef.current) return
      const firstInvalid = fields.find((_, index) => !valid[index])
      if (firstInvalid) {
        firstInvalid.focus()
        return
      }
      onFormSubmit?.(
        getValues() as FormValues,
        createGenericEventDetails(REASONS.none)
      )
    }
    if (results.some((result) => typeof result !== "boolean")) {
      return Promise.all(results).then(finish)
    }
    finish(results as boolean[])
  })

  React.useImperativeHandle(actionsRef, () => ({ validate, submit }), [
    validate,
    submit,
  ])

  const state = React.useMemo<RootState>(
    () => ({ submitAttempted }),
    [submitAttempted]
  )

  const context = React.useMemo<FormContextValue>(
    () => ({
      errors,
      clearErrors,
      validationMode,
      submitAttempted,
      register,
      getValues,
      submit,
      validate,
    }),
    [
      errors,
      clearErrors,
      validationMode,
      submitAttempted,
      register,
      getValues,
      submit,
      validate,
    ]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: [elementProps],
  })

  return <FormContext.Provider value={context}>{element}</FormContext.Provider>
}

Root.displayName = "Form"

export type {
  Actions,
  Errors,
  FieldRegistration,
  FormContextValue,
  RootProps,
  RootState,
  SubmitEventDetails,
  SubmitEventReason,
  ValidationMode,
  Values,
}
export { Root, useFormContext }
