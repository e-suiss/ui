"use client"

import { Slot } from "radix-ui"
import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { type Button, buttonVariants } from "@/components/ui/button"
import {
  QuestionnaireContext,
  QuestionnaireItemContext,
  type QuestionnaireItemDefinition,
  type QuestionnaireItemStatus,
  type QuestionnaireShortcutMode,
  useQuestionnaire,
  useQuestionnaireChoice,
  useQuestionnaireContext,
  useQuestionnaireDescription,
  useQuestionnaireError,
  useQuestionnaireInput,
  useQuestionnaireItem,
  useQuestionnaireItemContext,
} from "@/hooks/use-questionnaire"
import { cn } from "@/lib/utils"

type QuestionnaireInputType =
  | "date"
  | "datetime-local"
  | "email"
  | "month"
  | "number"
  | "password"
  | "search"
  | "tel"
  | "text"
  | "time"
  | "url"
  | "week"

type QuestionnaireNavigationState = {
  disabled: boolean
  shortcut: "Enter" | null
  status: QuestionnaireItemStatus | null
  visible: boolean
}

type QuestionnaireNavigationProps = React.ComponentProps<"button"> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant"> & {
    asChild?: boolean
  }

type StateAttributesMapping = Record<
  string,
  (value: boolean) => Record<string, string>
>

function toggleAttributes(on: string, off: string) {
  return (value: boolean): Record<string, string> =>
    value ? { [on]: "" } : { [off]: "" }
}

function stateAttributes(
  state: object,
  mapping: StateAttributesMapping = {}
): Record<string, string> {
  const attributes: Record<string, string> = {}
  for (const [key, value] of Object.entries(state)) {
    const map = mapping[key]
    if (map) Object.assign(attributes, map(Boolean(value)))
    else if (value === true) attributes[`data-${key.toLowerCase()}`] = ""
    else if (value) attributes[`data-${key.toLowerCase()}`] = String(value)
  }
  return attributes
}

function mergeHandlers<Props extends object>(
  internal: Props,
  external: object
): Props {
  const merged = { ...internal, ...external } as Record<string, unknown>
  for (const [key, handler] of Object.entries(internal)) {
    const override = (external as Record<string, unknown>)[key]
    if (
      key.startsWith("on") &&
      typeof handler === "function" &&
      typeof override === "function"
    ) {
      merged[key] = (...args: unknown[]) => {
        override(...args)
        handler(...args)
      }
    }
  }
  return merged as Props
}

const checkedAttributes = {
  checked: toggleAttributes("data-checked", "data-unchecked"),
}

const filledAttributes = {
  filled: toggleAttributes("data-filled", "data-empty"),
}

const visibleAttributes = {
  visible: toggleAttributes("data-visible", "data-hidden"),
}

const QuestionnaireChoiceContext = React.createContext<{
  descriptionId: string
  setDescribed: (described: boolean) => void
} | null>(null)

const QuestionnaireTitleIdContext = React.createContext<string | undefined>(
  undefined
)

function Questionnaire({
  className,
  defaultItem,
  item,
  items,
  noValidate = true,
  onItemChange,
  onReset,
  onSubmit,
  ref,
  shortcuts,
  ...props
}: Omit<React.ComponentProps<"form">, "defaultValue" | "value"> & {
  defaultItem?: string
  item?: string
  items?: readonly QuestionnaireItemDefinition[]
  onItemChange?: (item: string) => void
  shortcuts?: QuestionnaireShortcutMode
}) {
  const { ref: questionnaireRef, ...questionnaire } = useQuestionnaire({
    defaultItem,
    item,
    items,
    noValidate,
    onItemChange,
    onReset,
    onSubmit,
    ref,
    shortcuts,
  })
  return (
    <QuestionnaireContext.Provider value={questionnaire.context}>
      <form
        ref={questionnaireRef}
        {...stateAttributes(questionnaire.state)}
        data-slot="questionnaire"
        {...mergeHandlers(questionnaire.props, props)}
        className={cn(
          "cn-questionnaire flex w-full min-w-0 flex-col",
          className
        )}
      />
    </QuestionnaireContext.Provider>
  )
}

function QuestionnaireProgress({
  children,
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const { current, first, last, total } = useQuestionnaireContext(
    "QuestionnaireProgress"
  )
  const valueText = total ? `Question ${current} of ${total}` : undefined

  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      {...stateAttributes({ current, first, last, total })}
      aria-label="Questionnaire progress"
      aria-live="polite"
      aria-valuemax={total || undefined}
      aria-valuemin={total ? 1 : undefined}
      aria-valuenow={total ? current : undefined}
      aria-valuetext={valueText}
      role="progressbar"
      data-slot="questionnaire-progress"
      className={cn(
        "cn-questionnaire-progress min-h-[1lh] w-fit min-w-[14ch] text-muted-foreground tabular-nums",
        className
      )}
      {...props}
    >
      {children ?? valueText}
    </Comp>
  )
}

function QuestionnaireItem({
  "aria-describedby": ariaDescribedBy,
  "aria-keyshortcuts": ariaKeyShortcuts,
  children,
  className,
  disabled = false,
  invalid = false,
  multiple = false,
  name,
  onStatusChange,
  ref,
  required = false,
  ...props
}: Omit<React.ComponentProps<"fieldset">, "name" | "value"> & {
  invalid?: boolean
  multiple?: boolean
  name: string
  onStatusChange?: (status: QuestionnaireItemStatus) => void
  required?: boolean
}) {
  const { ref: questionnaireItemRef, ...questionnaireItem } =
    useQuestionnaireItem({
      "aria-describedby": ariaDescribedBy,
      "aria-keyshortcuts": ariaKeyShortcuts,
      disabled,
      invalid,
      multiple,
      name,
      onStatusChange,
      ref,
      required,
    })
  const titleId = React.useId()
  return (
    <QuestionnaireItemContext.Provider value={questionnaireItem.context}>
      <QuestionnaireTitleIdContext.Provider value={titleId}>
        <fieldset
          ref={questionnaireItemRef}
          {...stateAttributes(questionnaireItem.state)}
          {...questionnaireItem.props}
          data-slot="questionnaire-item"
          className={cn(
            "cn-questionnaire-item min-w-0 border-0 p-0 outline-none",
            className
          )}
          {...props}
        >
          {children}
        </fieldset>
      </QuestionnaireTitleIdContext.Provider>
    </QuestionnaireItemContext.Provider>
  )
}

function QuestionnaireTitle({
  className,
  asChild = false,
  ...props
}: Omit<React.ComponentProps<"legend">, "id"> & { asChild?: boolean }) {
  useQuestionnaireItemContext("QuestionnaireTitle")
  const titleId = React.useContext(QuestionnaireTitleIdContext)

  const Comp = asChild ? Slot.Root : "legend"

  return (
    <Comp
      id={titleId}
      data-slot="questionnaire-title"
      className={cn(
        "cn-font-heading cn-questionnaire-title text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-5",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireDescription({
  className,
  id: idProp,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  useQuestionnaireDescription(id)
  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      id={id}
      data-slot="questionnaire-description"
      className={cn(
        "cn-questionnaire-description text-pretty text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireChoices({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<"div"> & { asChild?: boolean }) {
  const { shortcuts } = useQuestionnaireItemContext("QuestionnaireChoices")
  const Comp = asChild ? Slot.Root : "div"

  return (
    <Comp
      {...stateAttributes({ shortcuts })}
      data-slot="questionnaire-choices"
      className={cn(
        "cn-questionnaire-choices grid min-w-0 group/questionnaire-choices",
        className
      )}
      {...props}
    />
  )
}

function QuestionnaireChoice({
  checked,
  children,
  className,
  defaultChecked = false,
  disabled = false,
  onChange,
  value,
  asChild = false,
  ...props
}: Omit<React.ComponentProps<"label">, "onChange"> & {
  asChild?: boolean
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
  value: string
}) {
  const { inputProps, state } = useQuestionnaireChoice({
    checked,
    defaultChecked,
    disabled,
    onChange,
    value,
  })
  const descriptionId = React.useId()
  const [described, setDescribed] = React.useState(false)
  const choice = React.useMemo(
    () => ({ descriptionId, setDescribed }),
    [descriptionId]
  )
  const attributes = stateAttributes(state, checkedAttributes)
  const element =
    asChild && React.isValidElement<{ children?: React.ReactNode }>(children)
      ? children
      : null
  const content = (label: React.ReactNode) => (
    <>
      <input
        {...attributes}
        {...inputProps}
        aria-describedby={described ? descriptionId : undefined}
        data-slot="questionnaire-choice-input"
        className="cn-questionnaire-choice-input absolute inset-0 z-10 size-full cursor-pointer opacity-0"
      />
      <span
        aria-hidden="true"
        data-slot="questionnaire-choice-indicator"
        className="cn-questionnaire-choice-indicator pointer-events-none relative flex shrink-0 items-center justify-center border"
      >
        <span
          data-slot="questionnaire-choice-indicator-dot"
          className="cn-questionnaire-choice-indicator-dot hidden rounded-full group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
        />
        <IconPlaceholder
          lucide="CheckIcon"
          tabler="IconCheck"
          hugeicons="Tick02Icon"
          phosphor="CheckIcon"
          remixicon="RiCheckLine"
          data-slot="questionnaire-choice-indicator-check"
          className="cn-questionnaire-choice-indicator-check hidden group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
        />
      </span>
      <span
        data-slot="questionnaire-choice-label"
        className="cn-questionnaire-choice-label cn-questionnaire-choice-content flex min-w-0 flex-1 flex-col"
      >
        <QuestionnaireChoiceContext.Provider value={choice}>
          {label}
        </QuestionnaireChoiceContext.Provider>
      </span>
      <span
        aria-hidden="true"
        hidden={state.shortcut === null}
        data-shortcut={state.shortcut ?? undefined}
        data-slot="questionnaire-choice-shortcut"
        className="cn-questionnaire-choice-shortcut cn-questionnaire-shortcut pointer-events-none ms-auto shrink-0"
      >
        {state.shortcut}
      </span>
    </>
  )
  const Comp = asChild ? Slot.Root : "label"

  return (
    <Comp
      {...attributes}
      data-slot="questionnaire-choice"
      className={cn(
        "cn-questionnaire-choice group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start text-start transition-colors outline-none select-none",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
        className
      )}
      {...props}
    >
      {element
        ? React.cloneElement(
            element,
            undefined,
            content(element.props.children)
          )
        : content(children)}
    </Comp>
  )
}

function QuestionnaireChoiceDescription({
  className,
  ...props
}: React.ComponentProps<"span">) {
  const choice = React.useContext(QuestionnaireChoiceContext)

  React.useLayoutEffect(() => {
    if (!choice) return
    choice.setDescribed(true)
    return () => choice.setDescribed(false)
  }, [choice])

  return (
    <span
      id={choice?.descriptionId}
      aria-hidden={choice ? true : undefined}
      data-slot="questionnaire-choice-description"
      className={cn("cn-questionnaire-choice-description", className)}
      {...props}
    />
  )
}

function QuestionnaireInput({
  className,
  defaultValue,
  disabled = false,
  onChange,
  ref,
  asChild = false,
  type = "text",
  value,
  ...props
}: Omit<React.ComponentProps<"input">, "form" | "name" | "type"> & {
  asChild?: boolean
  type?: QuestionnaireInputType
}) {
  const { ref: questionnaireInputRef, ...questionnaireInput } =
    useQuestionnaireInput({
      defaultValue,
      disabled,
      onChange,
      ref,
      type,
      value,
    })
  const titleId = React.useContext(QuestionnaireTitleIdContext)
  const Comp = asChild ? Slot.Root : "input"

  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="cn-questionnaire-input-wrapper relative min-w-0 group/questionnaire-input"
    >
      <Comp
        ref={questionnaireInputRef}
        {...stateAttributes(questionnaireInput.state, filledAttributes)}
        {...(props["aria-label"] === undefined && {
          "aria-labelledby": titleId,
        })}
        {...questionnaireInput.inputProps}
        data-slot="questionnaire-input"
        className={cn(
          "cn-questionnaire-input w-full min-w-0 transition-[color,box-shadow,background-color] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
          "selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground",
          className
        )}
        {...props}
      />
    </div>
  )
}

function QuestionnaireError({
  children,
  className,
  id: idProp,
  asChild = false,
  ...props
}: React.ComponentProps<"p"> & { asChild?: boolean }) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const { invalid, required } = useQuestionnaireError(id)

  const Comp = asChild ? Slot.Root : "p"

  return (
    <Comp
      {...stateAttributes({ invalid })}
      hidden={!invalid}
      id={id}
      role={invalid ? "alert" : undefined}
      data-slot="questionnaire-error"
      className={cn("cn-questionnaire-error text-destructive", className)}
      {...props}
    >
      {children ??
        (required
          ? "Choose an answer to continue."
          : "Choose an answer or skip this question.")}
    </Comp>
  )
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "cn-questionnaire-actions grid w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center",
        className
      )}
      {...props}
    />
  )
}

function useNavigationButton({
  action,
  children,
  className,
  disabled = false,
  label,
  onClick,
  placement,
  asChild = false,
  shortcut = null,
  size,
  slot,
  tabIndex,
  type = "button",
  variant,
  visible,
  ...props
}: QuestionnaireNavigationProps & {
  action?: () => void
  label: string
  placement: string
  shortcut?: "Enter" | null
  slot: string
  visible: boolean
}) {
  const { activeItemStatus } = useQuestionnaireContext(label)
  const activeShortcut = visible && !disabled ? shortcut : null

  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(event)
    if (!event.defaultPrevented) action?.()
  }

  const Comp = asChild ? Slot.Root : "button"
  const state: QuestionnaireNavigationState = {
    disabled,
    shortcut: activeShortcut,
    status: activeItemStatus,
    visible,
  }

  return (
    <Comp
      {...stateAttributes(state, visibleAttributes)}
      aria-hidden={!visible || undefined}
      aria-keyshortcuts={activeShortcut ?? undefined}
      disabled={disabled}
      hidden={!visible}
      inert={!visible}
      onClick={action ? handleClick : onClick}
      tabIndex={visible ? tabIndex : -1}
      type={type}
      data-slot={slot}
      data-size={size}
      data-variant={variant}
      className={cn(buttonVariants({ size, variant }), placement, className)}
      {...props}
    >
      {children}
    </Comp>
  )
}

function QuestionnairePrevious({
  children,
  size = "default",
  variant = "outline",
  ...props
}: QuestionnaireNavigationProps) {
  const { first, goPrevious, total } = useQuestionnaireContext(
    "QuestionnairePrevious"
  )

  return useNavigationButton({
    ...props,
    action: goPrevious,
    children: children ?? "Previous",
    label: "QuestionnairePrevious",
    placement: "col-start-1 row-start-1 min-h-11 justify-self-start sm:min-h-0",
    size,
    slot: "questionnaire-previous",
    variant,
    visible: total > 1 && !first,
  })
}

function QuestionnaireSkip({
  children,
  size = "default",
  variant = "outline",
  ...props
}: QuestionnaireNavigationProps) {
  const { activeItemRequired, skipCurrent } =
    useQuestionnaireContext("QuestionnaireSkip")

  return useNavigationButton({
    ...props,
    action: skipCurrent,
    children: children ?? "Skip",
    label: "QuestionnaireSkip",
    placement: "col-start-2 row-start-1 min-h-11 justify-self-end sm:min-h-0",
    size,
    slot: "questionnaire-skip",
    variant,
    visible: activeItemRequired === false,
  })
}

function QuestionnaireNext({
  children,
  size = "default",
  variant = "default",
  ...props
}: QuestionnaireNavigationProps) {
  const { goNext, last, total } = useQuestionnaireContext("QuestionnaireNext")

  return useNavigationButton({
    ...props,
    action: goNext,
    children: children ?? "Next",
    label: "QuestionnaireNext",
    placement: "col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0",
    shortcut: "Enter",
    size,
    slot: "questionnaire-next",
    variant,
    visible: total > 1 && !last,
  })
}

function QuestionnaireSubmit({
  children,
  size = "default",
  type = "submit",
  variant = "default",
  ...props
}: QuestionnaireNavigationProps) {
  const { last, total } = useQuestionnaireContext("QuestionnaireSubmit")

  return useNavigationButton({
    ...props,
    children: children ?? "Submit",
    label: "QuestionnaireSubmit",
    placement: "col-start-3 row-start-1 min-h-11 justify-self-end sm:min-h-0",
    shortcut: "Enter",
    size,
    slot: "questionnaire-submit",
    type,
    variant,
    visible: total > 0 && last,
  })
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
}
