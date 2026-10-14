"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { CheckIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"
import { type Button, buttonVariants } from "@/components/ui/button"
import {
  type QuestionnaireChoiceState,
  QuestionnaireContext,
  type QuestionnaireInputState,
  QuestionnaireItemContext,
  type QuestionnaireItemDefinition,
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
} from "@/hooks/use-questionnaire"

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

type QuestionnaireNavigationProps = useRender.ComponentProps<
  "button",
  QuestionnaireNavigationState
> &
  Pick<React.ComponentProps<typeof Button>, "size" | "variant">

function toggleAttributes(on: string, off: string) {
  return (value: boolean): Record<string, string> =>
    value ? { [on]: "" } : { [off]: "" }
}

const checkedAttributes = {
  checked: toggleAttributes("data-checked", "data-unchecked"),
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
  const questionnaire = useQuestionnaire({
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
  const element = useRender({
    defaultTagName: "form",
    ref: questionnaire.ref,
    state: questionnaire.state,
    props: {
      "data-slot": "questionnaire",
      ...mergeProps<"form">(questionnaire.props, props),
      className: cn("flex w-full min-w-0 flex-col gap-6", className),
    },
  })

  return (
    <QuestionnaireContext.Provider value={questionnaire.context}>
      {element}
    </QuestionnaireContext.Provider>
  )
}

function QuestionnaireProgress({
  children,
  className,
  render,
  ...props
}: useRender.ComponentProps<"div", QuestionnaireState>) {
  const { current, first, last, total } = useQuestionnaireContext(
    "QuestionnaireProgress"
  )
  const valueText = total ? `Question ${current} of ${total}` : undefined

  return useRender({
    defaultTagName: "div",
    render,
    state: { current, first, last, total },
    props: {
      "aria-label": "Questionnaire progress",
      "aria-live": "polite",
      "aria-valuemax": total || undefined,
      "aria-valuemin": total ? 1 : undefined,
      "aria-valuenow": total ? current : undefined,
      "aria-valuetext": valueText,
      children: children ?? valueText,
      role: "progressbar",
      "data-slot": "questionnaire-progress",
      className: cn(
        "min-h-[1lh] w-fit min-w-[14ch] text-xs text-label-secondary tabular-nums",
        className
      ),
      ...props,
    },
  })
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
  const questionnaireItem = useQuestionnaireItem({
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
  const element = useRender({
    defaultTagName: "fieldset",
    ref: questionnaireItem.ref,
    state: questionnaireItem.state,
    props: {
      ...questionnaireItem.props,
      children,
      "data-slot": "questionnaire-item",
      className: cn(
        "flex min-w-0 flex-col gap-5 border-0 p-0 outline-none",
        className
      ),
      ...props,
    },
  })

  return (
    <QuestionnaireItemContext.Provider value={questionnaireItem.context}>
      <QuestionnaireTitleIdContext.Provider value={titleId}>
        {element}
      </QuestionnaireTitleIdContext.Provider>
    </QuestionnaireItemContext.Provider>
  )
}

function QuestionnaireTitle({
  className,
  render,
  ...props
}: Omit<useRender.ComponentProps<"legend">, "id">) {
  useQuestionnaireItemContext("QuestionnaireTitle")
  const titleId = React.useContext(QuestionnaireTitleIdContext)

  return useRender({
    defaultTagName: "legend",
    render,
    props: {
      id: titleId,
      "data-slot": "questionnaire-title",
      className: cn(
        "text-base font-semibold text-pretty [&:not(:has(~[data-slot=questionnaire-description]))]:mb-5",
        className
      ),
      ...props,
    },
  })
}

function QuestionnaireDescription({
  className,
  id: idProp,
  render,
  ...props
}: useRender.ComponentProps<"p">) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  useQuestionnaireDescription(id)

  return useRender({
    defaultTagName: "p",
    render,
    props: {
      id,
      "data-slot": "questionnaire-description",
      className: cn("text-sm text-pretty text-label-secondary", className),
      ...props,
    },
  })
}

function QuestionnaireChoices({
  className,
  render,
  ...props
}: useRender.ComponentProps<
  "div",
  { shortcuts: QuestionnaireShortcutMode | null }
>) {
  const { shortcuts } = useQuestionnaireItemContext("QuestionnaireChoices")

  return useRender({
    defaultTagName: "div",
    render,
    state: { shortcuts },
    props: {
      "data-slot": "questionnaire-choices",
      className: cn("grid min-w-0 gap-3", className),
      ...props,
    },
  })
}

function QuestionnaireChoice({
  checked,
  children,
  className,
  defaultChecked = false,
  disabled = false,
  onChange,
  render,
  value,
  ...props
}: Omit<
  useRender.ComponentProps<"label", QuestionnaireChoiceState>,
  "onChange"
> & {
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
  const input = useRender({
    defaultTagName: "input",
    state,
    stateAttributesMapping: checkedAttributes,
    props: {
      ...inputProps,
      "aria-describedby": described ? descriptionId : undefined,
      "data-slot": "questionnaire-choice-input",
      className: "absolute inset-0 z-10 size-full cursor-pointer opacity-0",
    },
  })

  return useRender({
    defaultTagName: "label",
    render,
    state,
    stateAttributesMapping: checkedAttributes,
    props: {
      "data-slot": "questionnaire-choice",
      className: cn(
        "group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start gap-2.5 rounded-xl border border-separator px-4 py-3 text-start text-base transition-colors outline-none select-none hover:bg-item-hover has-[>input:focus-visible]:focus-ring data-invalid:border-danger data-invalid:bg-danger/5 dark:data-invalid:bg-danger/10 data-checked:border-accent data-checked:ring-1 data-checked:ring-accent",
        "data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:text-label-quaternary",
        className
      ),
      ...props,
      children: (
        <>
          {input}
          <span
            aria-hidden="true"
            data-slot="questionnaire-choice-indicator"
            className="pointer-events-none relative flex size-4 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-xs border border-transparent bg-label-quaternary group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-[type=radio]/questionnaire-choice:rounded-full group-data-checked/questionnaire-choice:border-accent group-data-checked/questionnaire-choice:bg-accent group-data-checked/questionnaire-choice:text-on-accent dark:group-data-checked/questionnaire-choice:bg-accent"
          >
            <span
              data-slot="questionnaire-choice-indicator-dot"
              className="hidden size-2 rounded-full bg-on-accent group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block dark:size-2.5"
            />
            <CheckIcon
              data-slot="questionnaire-choice-indicator-check"
              className="hidden size-3.5 group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
            />
          </span>
          <span
            data-slot="questionnaire-choice-label"
            className="flex min-w-0 flex-1 flex-col gap-1"
          >
            <QuestionnaireChoiceContext.Provider value={choice}>
              {children}
            </QuestionnaireChoiceContext.Provider>
          </span>
          <span
            aria-hidden="true"
            hidden={state.shortcut === null}
            data-shortcut={state.shortcut ?? undefined}
            data-slot="questionnaire-choice-shortcut"
            className="pointer-events-none ms-auto hidden size-5 shrink-0 translate-y-[--spacing(0.45)] items-center justify-center rounded-full border border-accent/10 bg-surface/80 font-mono text-3xs leading-none text-label-secondary group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 group-data-shortcut/questionnaire-choice:inline-flex max-md:hidden!"
          >
            {state.shortcut}
          </span>
        </>
      ),
    },
  })
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
      className={cn("text-label-secondary", className)}
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
  render,
  type = "text",
  value,
  ...props
}: Omit<
  useRender.ComponentProps<"input", QuestionnaireInputState>,
  "form" | "name" | "type"
> & {
  type?: QuestionnaireInputType
}) {
  const questionnaireInput = useQuestionnaireInput({
    defaultValue,
    disabled,
    onChange,
    ref,
    type,
    value,
  })
  const titleId = React.useContext(QuestionnaireTitleIdContext)
  const input = useRender({
    defaultTagName: "input",
    ref: questionnaireInput.ref,
    render,
    state: questionnaireInput.state,
    stateAttributesMapping: {
      filled: toggleAttributes("data-filled", "data-empty"),
    },
    props: {
      ...(props["aria-label"] === undefined && {
        "aria-labelledby": titleId,
      }),
      ...questionnaireInput.inputProps,
      "data-slot": "questionnaire-input",
      className: cn(
        "h-11 w-full min-w-0 rounded-lg border border-transparent bg-control px-3 py-1 text-base transition-[color,box-shadow,background-color] outline-none focus-visible:focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:text-label-quaternary aria-invalid:border-danger aria-invalid:bg-danger/5 dark:aria-invalid:bg-danger/10",
        "selection:bg-accent selection:text-on-accent placeholder:text-label-secondary",
        className
      ),
      ...props,
    },
  })

  return (
    <div
      data-slot="questionnaire-input-wrapper"
      className="relative w-full min-w-0"
    >
      {input}
    </div>
  )
}

function QuestionnaireError({
  children,
  className,
  id: idProp,
  render,
  ...props
}: useRender.ComponentProps<"p", { invalid: boolean }>) {
  const generatedId = React.useId()
  const id = idProp ?? generatedId
  const { invalid, required } = useQuestionnaireError(id)

  return useRender({
    defaultTagName: "p",
    render,
    state: { invalid },
    props: {
      children:
        children ??
        (required
          ? "Choose an answer to continue."
          : "Choose an answer or skip this question."),
      hidden: !invalid,
      id,
      role: invalid ? "alert" : undefined,
      "data-slot": "questionnaire-error",
      className: cn("mt-2 text-sm text-danger", className),
      ...props,
    },
  })
}

function QuestionnaireActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="questionnaire-actions"
      className={cn(
        "grid min-h-11 w-full grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-2 sm:min-h-9",
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
  render,
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

  return useRender({
    defaultTagName: "button",
    render,
    state: {
      disabled,
      shortcut: activeShortcut,
      status: activeItemStatus,
      visible,
    },
    stateAttributesMapping: {
      visible: toggleAttributes("data-visible", "data-hidden"),
    },
    props: {
      "aria-hidden": !visible || undefined,
      "aria-keyshortcuts": activeShortcut ?? undefined,
      children,
      disabled,
      hidden: !visible,
      inert: !visible,
      onClick: action ? handleClick : onClick,
      tabIndex: visible ? tabIndex : -1,
      type,
      "data-slot": slot,
      "data-size": size,
      "data-variant": variant,
      className: cn(buttonVariants({ size, variant }), placement, className),
      ...props,
    },
  })
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
