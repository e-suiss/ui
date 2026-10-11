import * as React from "react"

type QuestionnaireItemStatus = "unanswered" | "answered" | "skipped"

type QuestionnaireShortcutMode = "letters" | "numbers"

type QuestionnaireChoiceDefinition = {
  disabled?: boolean
  value: string
}

type QuestionnaireItemDefinition = {
  choices?: readonly QuestionnaireChoiceDefinition[]
  disabled?: boolean
  name: string
  required?: boolean
}

type QuestionnaireState = {
  current: number
  first: boolean
  last: boolean
  total: number
}

type QuestionnaireItemState = {
  active: boolean
  disabled: boolean
  invalid: boolean
  multiple: boolean
  required: boolean
  status: QuestionnaireItemStatus
}

type QuestionnaireChoiceState = {
  checked: boolean
  disabled: boolean
  invalid: boolean
  shortcut: string | null
  type: "checkbox" | "radio"
}

type QuestionnaireInputState = {
  disabled: boolean
  filled: boolean
  invalid: boolean
}

type AnswerControl = {
  disabled: boolean
  element: HTMLInputElement
  id: string
} & ({ type: "choice"; value: string } | { type: "input" })

type FocusDirection = "next" | "previous"

type ItemRecord = {
  disabled: boolean
  element: HTMLFieldSetElement
  focus: () => void
  focusInvalid: () => void
  getAnswerByElement: (target: Element) => AnswerControl | null
  getAnswerByShortcut: (shortcut: string) => AnswerControl | null
  moveAnswerFocus: (target: Element, direction: FocusDirection) => boolean
  name: string
  required: boolean
  reset: () => void
  skip: () => void
  status: QuestionnaireItemStatus
  validate: () => boolean
}

type ItemDefinitions = {
  enabledItems: readonly QuestionnaireItemDefinition[]
  itemByName: Map<string, QuestionnaireItemDefinition>
}

type QuestionnaireContextValue = QuestionnaireState & {
  activeItemName: string | null
  activeItemRequired: boolean | null
  activeItemStatus: QuestionnaireItemStatus | null
  domVersion: number
  goNext: () => void
  goPrevious: () => void
  itemDefinitions: Map<string, QuestionnaireItemDefinition> | null
  nativeValidation: boolean
  registerItem: (record: ItemRecord) => () => void
  shortcuts: QuestionnaireShortcutMode | null
  skipCurrent: () => void
}

type QuestionnaireItemContextValue = {
  disabled: boolean
  hasInputAnswer: boolean
  invalid: boolean
  multiple: boolean
  name: string
  registerAnswerControl: (control: AnswerControl) => () => void
  registerAnswerSelection: (id: string, selected: boolean) => () => void
  registerDescription: (id: string) => () => void
  registerError: (id: string) => () => void
  required: boolean
  resetVersion: number
  selectAnswer: (id: string, selected: boolean) => void
  selectedAnswerIds: string[]
  setAnswerDefault: (id: string, selected: boolean) => void
  shortcutByAnswerId: Map<string, string>
  shortcutByChoiceValue: Map<string, string> | null
  shortcuts: QuestionnaireShortcutMode | null
  status: QuestionnaireItemStatus
  syncControlledAnswer: (id: string, selected: boolean) => void
}

const QuestionnaireContext =
  React.createContext<QuestionnaireContextValue | null>(null)

const QuestionnaireItemContext =
  React.createContext<QuestionnaireItemContextValue | null>(null)

function useQuestionnaireContext(component: string) {
  const context = React.useContext(QuestionnaireContext)
  if (!context) {
    throw new Error(`${component} must be used within a Questionnaire.`)
  }
  return context
}

function useQuestionnaireItemContext(component: string) {
  const context = React.useContext(QuestionnaireItemContext)
  if (!context) {
    throw new Error(`${component} must be used within a QuestionnaireItem.`)
  }
  return context
}

function hasText(value: unknown) {
  if (Array.isArray(value)) {
    return value.some((entry) => String(entry).trim().length > 0)
  }
  return value != null && String(value).trim().length > 0
}

function getShortcutKeys(mode: QuestionnaireShortcutMode | null) {
  if (mode === "letters") {
    return Array.from({ length: 26 }, (_, index) =>
      String.fromCharCode(65 + index)
    )
  }
  if (mode === "numbers") {
    return Array.from({ length: 9 }, (_, index) => String(index + 1))
  }
  return []
}

function matchShortcut(key: string, mode: QuestionnaireShortcutMode) {
  const normalized = mode === "letters" ? key.toUpperCase() : key
  return getShortcutKeys(mode).includes(normalized) ? normalized : null
}

function joinKeyShortcuts(shortcut: string | null, submitsOnEnter: boolean) {
  return (
    [shortcut, submitsOnEnter ? "Enter" : null].filter(Boolean).join(" ") ||
    undefined
  )
}

function isAnswered(control: AnswerControl) {
  if (control.type === "choice") return control.element.checked
  return control.element.hasAttribute("name") && hasText(control.element.value)
}

function isEmptyTextInput(control: AnswerControl | null) {
  return (
    control?.type === "input" &&
    ["email", "password", "search", "tel", "text", "url"].includes(
      control.element.type
    ) &&
    !hasText(control.element.value)
  )
}

function isTextEntry(target: EventTarget) {
  if (
    target instanceof HTMLTextAreaElement ||
    target instanceof HTMLSelectElement
  ) {
    return true
  }
  if (target instanceof HTMLInputElement) {
    return !["button", "checkbox", "radio", "reset", "submit"].includes(
      target.type
    )
  }
  return target instanceof HTMLElement && target.isContentEditable
}

function isRadio(target: EventTarget) {
  return target instanceof HTMLInputElement && target.type === "radio"
}

function isItemRequired(
  definition: QuestionnaireItemDefinition | undefined,
  record: ItemRecord | null
) {
  if (definition) return !!definition.required
  return record?.required ?? false
}

function itemStatus(
  skipped: boolean,
  hasAnswer: boolean
): QuestionnaireItemStatus {
  if (skipped) return "skipped"
  return hasAnswer ? "answered" : "unanswered"
}

function compareDocumentOrder(a: { element: Node }, b: { element: Node }) {
  if (a.element === b.element) return 0
  const position = a.element.compareDocumentPosition(b.element)
  if (position & Node.DOCUMENT_POSITION_FOLLOWING) return -1
  if (position & Node.DOCUMENT_POSITION_PRECEDING) return 1
  return 0
}

function createItemDefinitions(
  items: readonly QuestionnaireItemDefinition[] | undefined
): ItemDefinitions | null {
  if (items === undefined) return null
  return {
    enabledItems: items.filter((item) => !item.disabled),
    itemByName: new Map(items.map((item) => [item.name, item])),
  }
}

function resolveInitialItem(
  definitions: ItemDefinitions | null,
  name: string | undefined
) {
  if (!definitions) return name ?? null
  const definition = name ? definitions.itemByName.get(name) : undefined
  if (definition && !definition.disabled) return definition.name
  return definitions.enabledItems[0]?.name ?? null
}

function getDefinedShortcuts(
  definition: QuestionnaireItemDefinition | undefined,
  mode: QuestionnaireShortcutMode | null
) {
  const shortcuts = new Map<string, string>()
  if (!definition || !mode) return shortcuts
  const keys = getShortcutKeys(mode)
  const choices = (definition.choices ?? []).filter(
    (choice) => !choice.disabled
  )
  choices.forEach((choice, index) => {
    const key = keys[index]
    if (key) shortcuts.set(choice.value, key)
  })
  return shortcuts
}

function useRegisteredIds() {
  const [ids, setIds] = React.useState<string[]>([])
  const register = React.useCallback((id: string) => {
    setIds((current) => (current.includes(id) ? current : [...current, id]))
    return () => {
      setIds((current) => current.filter((entry) => entry !== id))
    }
  }, [])
  return [ids, register] as const
}

function useComposedRef<T>(
  setElement: (element: T | null) => void,
  ref: React.Ref<T> | undefined
) {
  return React.useCallback(
    (element: T | null) => {
      setElement(element)
      if (typeof ref === "function") return ref(element)
      if (ref) ref.current = element
    },
    [setElement, ref]
  )
}

type UseQuestionnaireParameters = {
  defaultItem?: string
  item?: string
  items?: readonly QuestionnaireItemDefinition[]
  noValidate: boolean
  onItemChange?: (item: string) => void
  onReset?: React.FormEventHandler<HTMLFormElement>
  onSubmit?: React.FormEventHandler<HTMLFormElement>
  ref?: React.Ref<HTMLFormElement>
  shortcuts?: QuestionnaireShortcutMode
}

function useQuestionnaire({
  defaultItem,
  item,
  items,
  noValidate,
  onItemChange,
  onReset,
  onSubmit,
  ref,
  shortcuts,
}: UseQuestionnaireParameters) {
  const definitions = React.useMemo(() => createItemDefinitions(items), [items])
  const [records, setRecords] = React.useState<ItemRecord[]>([])
  const [uncontrolledItem, setUncontrolledItem] = React.useState(() =>
    resolveInitialItem(definitions, defaultItem)
  )
  const [form, setForm] = React.useState<HTMLFormElement | null>(null)
  const [domVersion, setDomVersion] = React.useState(0)
  const pendingFocusRef = React.useRef<{
    name: string
    target: "item" | "invalid"
  } | null>(null)
  const controlled = item !== undefined
  const activeItemName = controlled ? item : uncontrolledItem
  const previousItemRef = React.useRef(activeItemName)
  const shortcutMode = shortcuts ?? null

  React.useLayoutEffect(() => {
    if (!form || typeof MutationObserver === "undefined") return
    const observer = new MutationObserver(() => {
      setDomVersion((version) => version + 1)
    })
    observer.observe(form, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [form])

  const renderedItems = React.useMemo(
    () =>
      records.filter((record) => !record.disabled).sort(compareDocumentOrder),
    [records, domVersion]
  )
  const recordByName = React.useMemo(
    () => new Map(renderedItems.map((record) => [record.name, record])),
    [renderedItems]
  )
  const sequence: readonly { name: string }[] =
    definitions?.enabledItems ?? renderedItems
  const index = sequence.findIndex((entry) => entry.name === activeItemName)
  const activeItem =
    index < 0 || !activeItemName
      ? null
      : (recordByName.get(activeItemName) ?? null)
  const activeDefinition = activeItemName
    ? definitions?.itemByName.get(activeItemName)
    : undefined
  const activeItemRequired =
    index < 0 ? null : isItemRequired(activeDefinition, activeItem)
  const activeItemStatus =
    index < 0
      ? null
      : (activeItem?.status ?? (activeItemName ? "unanswered" : null))
  const validationOrder = React.useMemo(
    () =>
      definitions
        ? definitions.enabledItems.flatMap((definition) => {
            const record = recordByName.get(definition.name)
            return record ? [record] : []
          })
        : renderedItems,
    [definitions, recordByName, renderedItems]
  )
  const total = sequence.length
  const current = index < 0 ? 0 : index + 1
  const first = total > 0 && index === 0
  const last = total > 0 && index === total - 1

  const navigate = React.useCallback(
    (name: string, target: "item" | "invalid" = "item") => {
      if (name === activeItemName) return
      pendingFocusRef.current = { name, target }
      if (!controlled) setUncontrolledItem(name)
      onItemChange?.(name)
    },
    [activeItemName, controlled, onItemChange]
  )

  React.useLayoutEffect(() => {
    const initial = sequence[0]
    if (!initial) return
    if (index < 0) {
      if (!controlled && activeItemName === null) {
        setUncontrolledItem(initial.name)
        return
      }
      navigate(initial.name)
      return
    }
    const pendingFocus = pendingFocusRef.current
    const changed = previousItemRef.current !== activeItemName
    previousItemRef.current = activeItemName
    if (!pendingFocus || pendingFocus.name !== activeItemName) {
      if (controlled && changed) {
        pendingFocusRef.current = null
        activeItem?.focus()
      }
      return
    }
    if (pendingFocus.target === "invalid") {
      activeItem?.focusInvalid()
    } else {
      activeItem?.focus()
    }
    pendingFocusRef.current = null
  }, [activeItem, activeItemName, controlled, index, sequence, navigate])

  const registerItem = React.useCallback((record: ItemRecord) => {
    setRecords((current) => [
      ...current.filter(
        (entry) =>
          entry.element !== record.element && entry.name !== record.name
      ),
      record,
    ])
    return () => {
      setRecords((current) => current.filter((entry) => entry !== record))
    }
  }, [])

  const goPrevious = React.useCallback(() => {
    const previous = sequence[index - 1]
    if (!previous) return
    navigate(previous.name)
  }, [index, sequence, navigate])

  const goNext = React.useCallback(() => {
    const next = sequence[index + 1]
    if (!activeItem || !next) return
    if (!activeItem.validate()) {
      activeItem.focusInvalid()
      return
    }
    navigate(next.name)
  }, [activeItem, index, sequence, navigate])

  const advance = React.useCallback(() => {
    if (!activeItem) return
    if (!activeItem.validate()) {
      activeItem.focusInvalid()
      return
    }
    if (last) {
      form?.requestSubmit()
      return
    }
    const next = sequence[index + 1]
    if (next) navigate(next.name)
  }, [activeItem, index, last, sequence, form, navigate])

  const skipCurrent = React.useCallback(() => {
    if (!activeItem || activeItem.required) return
    activeItem.skip()
    if (!last) {
      const next = sequence[index + 1]
      if (next) navigate(next.name)
      return
    }
    queueMicrotask(() => {
      form?.requestSubmit()
    })
  }, [activeItem, index, last, sequence, form, navigate])

  function handleReset(event: React.FormEvent<HTMLFormElement>) {
    onReset?.(event)
    if (event.defaultPrevented) return
    for (const record of records) record.reset()
    const target = definitions
      ? resolveInitialItem(definitions, defaultItem)
      : (renderedItems.find((record) => record.name === defaultItem)?.name ??
        renderedItems[0]?.name)
    if (target) navigate(target)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    const invalidItem = validationOrder.find((record) => !record.validate())
    if (invalidItem) {
      event.preventDefault()
      navigate(invalidItem.name, "invalid")
      if (invalidItem.name === activeItemName) {
        invalidItem.focusInvalid()
        pendingFocusRef.current = null
      }
      return
    }
    onSubmit?.(event)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLFormElement>) {
    const { target } = event
    if (
      event.defaultPrevented ||
      event.nativeEvent.isComposing ||
      event.keyCode === 229 ||
      !activeItem ||
      !(target instanceof Element)
    ) {
      return
    }
    if (
      event.key === "Enter" &&
      (event.metaKey || event.ctrlKey) &&
      !event.altKey &&
      !event.shiftKey
    ) {
      event.preventDefault()
      if (!event.repeat) advance()
      return
    }
    if (event.metaKey || event.ctrlKey || event.altKey) return
    if (
      (event.key === "ArrowUp" || event.key === "ArrowDown") &&
      activeItem.moveAnswerFocus(
        target,
        event.key === "ArrowDown" ? "next" : "previous"
      )
    ) {
      event.preventDefault()
      return
    }
    if (
      (event.key === "ArrowLeft" || event.key === "ArrowRight") &&
      !isTextEntry(target) &&
      !isRadio(target)
    ) {
      event.preventDefault()
      if (event.repeat) return
      if (event.key === "ArrowLeft") {
        goPrevious()
      } else if (activeItem.status !== "unanswered") {
        goNext()
      }
      return
    }
    if (event.key === "Enter") {
      const answer = activeItem.getAnswerByElement(target)
      if (!answer) return
      event.preventDefault()
      if (!event.repeat && isAnswered(answer)) advance()
      return
    }
    if (!shortcutMode || isTextEntry(target)) return
    const shortcut = matchShortcut(event.key, shortcutMode)
    const answer = shortcut ? activeItem.getAnswerByShortcut(shortcut) : null
    if (!answer) return
    event.preventDefault()
    if (event.repeat) return
    answer.element.focus()
    if (answer.type === "choice") answer.element.click()
  }

  const context = React.useMemo<QuestionnaireContextValue>(
    () => ({
      activeItemName,
      activeItemRequired,
      activeItemStatus,
      current,
      domVersion,
      first,
      goNext,
      goPrevious,
      itemDefinitions: definitions?.itemByName ?? null,
      last,
      nativeValidation: noValidate === false,
      registerItem,
      shortcuts: shortcutMode,
      skipCurrent,
      total,
    }),
    [
      activeItemName,
      activeItemRequired,
      activeItemStatus,
      current,
      definitions,
      domVersion,
      first,
      goNext,
      goPrevious,
      last,
      noValidate,
      registerItem,
      shortcutMode,
      skipCurrent,
      total,
    ]
  )

  const state: QuestionnaireState = { current, first, last, total }

  return {
    context,
    props: {
      "data-shortcuts": shortcutMode ?? undefined,
      noValidate,
      onKeyDown: handleKeyDown,
      onReset: handleReset,
      onSubmit: handleSubmit,
    },
    ref: useComposedRef(setForm, ref),
    state,
  }
}

type UseQuestionnaireItemParameters = {
  "aria-describedby"?: string
  "aria-keyshortcuts"?: string
  disabled: boolean
  invalid: boolean
  multiple: boolean
  name: string
  onStatusChange?: (status: QuestionnaireItemStatus) => void
  ref?: React.Ref<HTMLFieldSetElement>
  required: boolean
}

function useQuestionnaireItem({
  "aria-describedby": ariaDescribedBy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  disabled,
  invalid: invalidProp,
  multiple,
  name,
  onStatusChange,
  ref,
  required,
}: UseQuestionnaireItemParameters) {
  const root = useQuestionnaireContext("QuestionnaireItem")
  const [element, setElement] = React.useState<HTMLFieldSetElement | null>(null)
  const [controls, setControls] = React.useState<AnswerControl[]>([])
  const [attempted, setAttempted] = React.useState(false)
  const [selectedAnswerIds, setSelectedAnswerIds] = React.useState<string[]>([])
  const [skipped, setSkipped] = React.useState(false)
  const [resetVersion, setResetVersion] = React.useState(0)
  const [descriptionIds, registerDescription] = useRegisteredIds()
  const [errorIds, registerError] = useRegisteredIds()
  const defaultAnswerIdsRef = React.useRef<string[]>([])
  const multipleRef = React.useRef(multiple)
  const previousMultipleRef = React.useRef(multiple)
  multipleRef.current = multiple

  const active = !disabled && root.activeItemName === name
  const sortedControls = React.useMemo(
    () => [...controls].sort(compareDocumentOrder),
    [controls, root.domVersion]
  )
  const enabledControls = React.useMemo(
    () => sortedControls.filter((control) => !control.disabled),
    [sortedControls]
  )
  const hasAnswer = enabledControls.some((control) =>
    selectedAnswerIds.includes(control.id)
  )
  const status = itemStatus(skipped, hasAnswer)
  const skippedOptional = status === "skipped" && !required
  const satisfied =
    disabled || skippedOptional || (!invalidProp && status === "answered")
  const invalid =
    !disabled && !skippedOptional && (invalidProp || (attempted && !satisfied))
  const hasInputAnswer = enabledControls.some(
    (control) => control.type === "input"
  )
  const statusRef = React.useRef(status)
  const definition = root.itemDefinitions?.get(name)
  const shortcutByChoiceValue = React.useMemo(
    () =>
      root.itemDefinitions
        ? getDefinedShortcuts(definition, root.shortcuts)
        : null,
    [definition, root.itemDefinitions, root.shortcuts]
  )
  const shortcutByAnswerId = React.useMemo(() => {
    if (shortcutByChoiceValue) return new Map<string, string>()
    const keys = getShortcutKeys(root.shortcuts)
    const choices = enabledControls.filter(
      (control) => control.type === "choice"
    )
    const shortcuts = new Map<string, string>()
    choices.forEach((control, index) => {
      const key = keys[index]
      if (key) shortcuts.set(control.id, key)
    })
    return shortcuts
  }, [enabledControls, shortcutByChoiceValue, root.shortcuts])

  React.useLayoutEffect(() => {
    if (statusRef.current === status) return
    statusRef.current = status
    onStatusChange?.(status)
  }, [onStatusChange, status])

  const registerAnswerControl = React.useCallback((control: AnswerControl) => {
    setControls((current) => [
      ...current.filter(
        (entry) => entry.element !== control.element && entry.id !== control.id
      ),
      control,
    ])
    return () => {
      setControls((current) => current.filter((entry) => entry !== control))
    }
  }, [])

  const updateSelection = React.useCallback(
    (id: string, selected: boolean) => {
      setSelectedAnswerIds((current) => {
        if (!selected) return current.filter((entry) => entry !== id)
        if (!multiple) return [id]
        return current.includes(id) ? current : [...current, id]
      })
    },
    [multiple]
  )

  const selectAnswer = React.useCallback(
    (id: string, selected: boolean) => {
      setSkipped(false)
      updateSelection(id, selected)
    },
    [updateSelection]
  )

  const syncControlledAnswer = React.useCallback(
    (id: string, selected: boolean) => {
      if (selected) setSkipped(false)
      updateSelection(id, selected)
    },
    [updateSelection]
  )

  const registerAnswerSelection = React.useCallback(
    (id: string, selected: boolean) => {
      if (selected) {
        defaultAnswerIdsRef.current = [
          ...defaultAnswerIdsRef.current.filter((entry) => entry !== id),
          id,
        ]
        setSelectedAnswerIds((current) => {
          if (multipleRef.current) {
            return current.includes(id) ? current : [...current, id]
          }
          return current.length ? current : [id]
        })
      }
      return () => {
        defaultAnswerIdsRef.current = defaultAnswerIdsRef.current.filter(
          (entry) => entry !== id
        )
        setSelectedAnswerIds((current) =>
          current.filter((entry) => entry !== id)
        )
      }
    },
    []
  )

  const setAnswerDefault = React.useCallback(
    (id: string, selected: boolean) => {
      const defaults = defaultAnswerIdsRef.current.filter(
        (entry) => entry !== id
      )
      defaultAnswerIdsRef.current = selected ? [...defaults, id] : defaults
    },
    []
  )

  const validate = React.useCallback(() => {
    setAttempted(true)
    if (!satisfied) return false
    if (!root.nativeValidation) return true
    const invalidControl = enabledControls.find(
      (control) =>
        isAnswered(control) &&
        control.element.willValidate &&
        !control.element.validity.valid
    )
    if (!invalidControl) return true
    invalidControl.element.focus()
    invalidControl.element.reportValidity()
    return false
  }, [enabledControls, root.nativeValidation, satisfied])

  const focus = React.useCallback(() => {
    element?.focus()
  }, [element])

  const focusInvalid = React.useCallback(() => {
    const filledInput = element?.querySelector<HTMLElement>(
      "input[data-filled][name]:not(:disabled)"
    )
    const firstControl = element?.querySelector<HTMLElement>(
      "input:not([type=hidden]):not(:disabled), textarea:not(:disabled)"
    )
    ;(filledInput ?? firstControl ?? element)?.focus()
  }, [element])

  const reset = React.useCallback(() => {
    setAttempted(false)
    setSkipped(false)
    setSelectedAnswerIds(
      multiple
        ? [...defaultAnswerIdsRef.current]
        : defaultAnswerIdsRef.current.slice(0, 1)
    )
    setResetVersion((version) => version + 1)
  }, [multiple])

  const skip = React.useCallback(() => {
    if (required) return
    setSelectedAnswerIds([])
    setSkipped(true)
  }, [required])

  React.useLayoutEffect(() => {
    const wasMultiple = previousMultipleRef.current
    previousMultipleRef.current = multiple
    if (!wasMultiple || multiple) return
    setSelectedAnswerIds((current) => {
      const firstSelected = enabledControls.find((control) =>
        current.includes(control.id)
      )
      return firstSelected ? [firstSelected.id] : []
    })
  }, [enabledControls, multiple])

  const getAnswerByElement = React.useCallback(
    (target: Element) =>
      enabledControls.find((control) => control.element === target) ?? null,
    [enabledControls]
  )

  const getAnswerByShortcut = React.useCallback(
    (shortcut: string) => {
      if (shortcutByChoiceValue) {
        const value = [...shortcutByChoiceValue].find(
          ([, key]) => key === shortcut
        )?.[0]
        return (
          enabledControls.find(
            (control) => control.type === "choice" && control.value === value
          ) ?? null
        )
      }
      const id = [...shortcutByAnswerId].find(
        ([, key]) => key === shortcut
      )?.[0]
      return enabledControls.find((control) => control.id === id) ?? null
    },
    [enabledControls, shortcutByAnswerId, shortcutByChoiceValue]
  )

  const moveAnswerFocus = React.useCallback(
    (target: Element, direction: FocusDirection) => {
      const index = enabledControls.findIndex(
        (control) => control.element === target
      )
      const current = enabledControls[index] ?? null
      if (
        !enabledControls.length ||
        (isTextEntry(target) && !isEmptyTextInput(current)) ||
        (index < 0 && target !== element)
      ) {
        return false
      }
      const step = direction === "next" ? 1 : -1
      const next =
        index < 0
          ? (enabledControls.find(isAnswered) ??
            (direction === "next"
              ? enabledControls[0]
              : enabledControls.at(-1)))
          : enabledControls[
              (index + step + enabledControls.length) % enabledControls.length
            ]
      if (
        !next ||
        next.element === target ||
        (index >= 0 && isRadio(target) && isRadio(next.element))
      ) {
        return false
      }
      next.element.focus()
      if (next.type === "choice" && isRadio(next.element)) next.element.click()
      return true
    },
    [element, enabledControls]
  )

  React.useLayoutEffect(() => {
    if (!element) return
    return root.registerItem({
      disabled,
      element,
      focus,
      focusInvalid,
      getAnswerByElement,
      getAnswerByShortcut,
      moveAnswerFocus,
      name,
      required,
      reset,
      skip,
      status,
      validate,
    })
  }, [
    disabled,
    element,
    focus,
    focusInvalid,
    getAnswerByElement,
    getAnswerByShortcut,
    moveAnswerFocus,
    name,
    required,
    reset,
    root.registerItem,
    skip,
    status,
    validate,
  ])

  const context = React.useMemo<QuestionnaireItemContextValue>(
    () => ({
      disabled,
      hasInputAnswer,
      invalid,
      multiple,
      name,
      registerAnswerControl,
      registerAnswerSelection,
      registerDescription,
      registerError,
      required,
      resetVersion,
      selectAnswer,
      selectedAnswerIds,
      setAnswerDefault,
      shortcutByAnswerId,
      shortcutByChoiceValue,
      shortcuts: root.shortcuts,
      status,
      syncControlledAnswer,
    }),
    [
      disabled,
      hasInputAnswer,
      invalid,
      multiple,
      name,
      registerAnswerControl,
      registerAnswerSelection,
      registerDescription,
      registerError,
      required,
      resetVersion,
      selectAnswer,
      selectedAnswerIds,
      setAnswerDefault,
      shortcutByAnswerId,
      shortcutByChoiceValue,
      root.shortcuts,
      status,
      syncControlledAnswer,
    ]
  )

  const describedBy =
    [...descriptionIds, ...(invalid ? errorIds : []), ariaDescribedBy]
      .filter(Boolean)
      .join(" ") || undefined
  const keyShortcuts =
    [
      ariaKeyShortcuts,
      active ? "Meta+Enter Control+Enter" : undefined,
      active && enabledControls.length ? "ArrowUp ArrowDown" : undefined,
      active && !root.first ? "ArrowLeft" : undefined,
      active && !root.last && status !== "unanswered"
        ? "ArrowRight"
        : undefined,
    ]
      .filter(Boolean)
      .join(" ") || undefined

  const state: QuestionnaireItemState = {
    active,
    disabled,
    invalid,
    multiple,
    required,
    status,
  }

  return {
    context,
    props: {
      "aria-describedby": describedBy,
      "aria-invalid": invalid || undefined,
      "aria-keyshortcuts": keyShortcuts,
      disabled,
      hidden: !active,
      inert: !active,
      tabIndex: -1,
    },
    ref: useComposedRef(setElement, ref),
    state,
  }
}

type UseQuestionnaireChoiceParameters = {
  checked?: boolean
  defaultChecked: boolean
  disabled: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string
}

function useQuestionnaireChoice({
  checked,
  defaultChecked,
  disabled: disabledProp,
  onChange,
  value,
}: UseQuestionnaireChoiceParameters) {
  const item = useQuestionnaireItemContext("QuestionnaireChoice")
  const {
    registerAnswerControl,
    registerAnswerSelection,
    resetVersion,
    setAnswerDefault,
    syncControlledAnswer,
  } = item
  const id = React.useId()
  const [element, setElement] = React.useState<HTMLInputElement | null>(null)
  const initialCheckedRef = React.useRef(defaultChecked)
  const controlled = checked !== undefined
  const disabled = item.disabled || disabledProp
  const skipped = item.status === "skipped"
  const isChecked = controlled
    ? !skipped && !!checked
    : item.selectedAnswerIds.includes(id)
  const type = item.multiple ? "checkbox" : "radio"
  const shortcut =
    item.shortcutByChoiceValue?.get(value) ??
    item.shortcutByAnswerId.get(id) ??
    null

  React.useLayoutEffect(
    () => registerAnswerSelection(id, initialCheckedRef.current),
    [id, registerAnswerSelection]
  )

  React.useLayoutEffect(
    () => setAnswerDefault(id, defaultChecked),
    [id, defaultChecked, setAnswerDefault]
  )

  React.useLayoutEffect(() => {
    if (!element) return
    return registerAnswerControl({
      disabled,
      element,
      id,
      type: "choice",
      value,
    })
  }, [disabled, element, id, registerAnswerControl, value])

  React.useLayoutEffect(() => {
    if (controlled) syncControlledAnswer(id, !!checked)
  }, [checked, controlled, id, resetVersion, syncControlledAnswer])

  React.useLayoutEffect(() => {
    if (!element) return
    element.defaultChecked = controlled ? !!checked : defaultChecked
    if (resetVersion > 0) element.checked = isChecked
  }, [checked, controlled, defaultChecked, element, isChecked, resetVersion])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    if (event.defaultPrevented) return
    if (!controlled) {
      item.selectAnswer(id, event.target.checked)
      return
    }
    if (skipped && checked === event.target.checked) {
      item.selectAnswer(id, !!checked)
    }
  }

  const state: QuestionnaireChoiceState = {
    checked: isChecked,
    disabled,
    invalid: item.invalid,
    shortcut,
    type,
  }

  return {
    inputProps: {
      "aria-invalid": item.invalid || undefined,
      "aria-keyshortcuts": joinKeyShortcuts(shortcut, !disabled && isChecked),
      checked: isChecked,
      disabled,
      id,
      name: skipped ? undefined : item.name,
      onChange: handleChange,
      ref: setElement,
      required: item.required && !item.multiple && !item.hasInputAnswer,
      type,
      value,
    },
    state,
  }
}

type UseQuestionnaireInputParameters = {
  defaultValue?: React.InputHTMLAttributes<HTMLInputElement>["defaultValue"]
  disabled: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  ref?: React.Ref<HTMLInputElement>
  type: string
  value?: React.InputHTMLAttributes<HTMLInputElement>["value"]
}

function useQuestionnaireInput({
  defaultValue,
  disabled: disabledProp,
  onChange,
  ref,
  type,
  value,
}: UseQuestionnaireInputParameters) {
  const item = useQuestionnaireItemContext("QuestionnaireInput")
  const {
    registerAnswerControl,
    registerAnswerSelection,
    resetVersion,
    setAnswerDefault,
    syncControlledAnswer,
  } = item
  const id = React.useId()
  const elementRef = React.useRef<HTMLInputElement | null>(null)
  const setElement = React.useCallback((element: HTMLInputElement | null) => {
    elementRef.current = element
  }, [])
  const controlled = value !== undefined
  const defaultFilled = hasText(defaultValue)
  const valueFilled = hasText(value)
  const initialFilledRef = React.useRef(defaultFilled)
  const [uncontrolledFilled, setUncontrolledFilled] =
    React.useState(defaultFilled)
  const disabled = item.disabled || disabledProp
  const filled = controlled ? valueFilled : uncontrolledFilled
  const selected = item.selectedAnswerIds.includes(id)

  React.useLayoutEffect(
    () => registerAnswerSelection(id, initialFilledRef.current),
    [id, registerAnswerSelection]
  )

  React.useLayoutEffect(
    () => setAnswerDefault(id, defaultFilled),
    [defaultFilled, id, setAnswerDefault]
  )

  React.useLayoutEffect(() => {
    const element = elementRef.current
    if (!element) return
    return registerAnswerControl({ disabled, element, id, type: "input" })
  }, [disabled, id, registerAnswerControl])

  React.useLayoutEffect(() => {
    if (controlled) {
      syncControlledAnswer(id, valueFilled)
      return
    }
    if (resetVersion > 0) setUncontrolledFilled(defaultFilled)
  }, [
    controlled,
    defaultFilled,
    id,
    resetVersion,
    syncControlledAnswer,
    value,
    valueFilled,
  ])

  React.useLayoutEffect(() => {
    const element = elementRef.current
    if (element && controlled) element.defaultValue = String(value)
  }, [controlled, value])

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    onChange?.(event)
    if (event.defaultPrevented || controlled) return
    const nextFilled = event.target.value.trim().length > 0
    setUncontrolledFilled(nextFilled)
    item.selectAnswer(id, nextFilled)
  }

  const state: QuestionnaireInputState = {
    disabled,
    filled,
    invalid: item.invalid,
  }

  return {
    inputProps: {
      "aria-invalid": item.invalid || undefined,
      "aria-keyshortcuts": joinKeyShortcuts(
        null,
        !disabled && filled && selected
      ),
      defaultValue: controlled ? undefined : defaultValue,
      disabled,
      form: selected ? undefined : "",
      id,
      name: selected ? item.name : undefined,
      onChange: handleChange,
      type,
      value: controlled ? value : undefined,
    },
    ref: useComposedRef(setElement, ref),
    state,
  }
}

function useQuestionnaireDescription(id: string) {
  const { registerDescription } = useQuestionnaireItemContext(
    "QuestionnaireDescription"
  )
  React.useLayoutEffect(
    () => registerDescription(id),
    [id, registerDescription]
  )
}

function useQuestionnaireError(id: string) {
  const { invalid, registerError, required } =
    useQuestionnaireItemContext("QuestionnaireError")
  React.useLayoutEffect(() => registerError(id), [id, registerError])
  return { invalid, required }
}

export {
  type QuestionnaireChoiceDefinition,
  type QuestionnaireChoiceState,
  QuestionnaireContext,
  type QuestionnaireInputState,
  QuestionnaireItemContext,
  type QuestionnaireItemDefinition,
  type QuestionnaireItemState,
  type QuestionnaireItemStatus,
  type QuestionnaireShortcutMode,
  type QuestionnaireState,
  useQuestionnaire,
  useQuestionnaireChoice,
  useQuestionnaireContext,
  useQuestionnaireDescription,
  useQuestionnaireError,
  useQuestionnaireInput,
  useQuestionnaireItem,
  useQuestionnaireItemContext,
}
