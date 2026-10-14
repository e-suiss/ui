import { cn } from "cn"
import { CheckIcon, MinusIcon } from "phosphor-react-native"
import * as CheckboxPrimitive from "@/components/primitives/checkbox"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"

const HIT_SLOP = { top: 8, bottom: 8, left: 12, right: 12 }

function checkboxClassName(
  state: CheckboxPrimitive.RootState,
  invalid: boolean | undefined
) {
  const checked = state.checked || state.indeterminate
  return cn(
    "size-4 shrink-0 items-center justify-center rounded-[4px] border",
    checked
      ? state.disabled
        ? "border-transparent bg-accent-disabled"
        : "border-accent bg-accent active:border-accent-pressed active:bg-accent-pressed"
      : state.disabled
        ? "border-label-10 bg-control-disabled dark:border-transparent"
        : cn(
            "border-label-25 bg-surface shadow-sm active:bg-control dark:border-transparent dark:bg-label-quaternary dark:shadow-none",
            invalid && "border-danger dark:border-danger"
          )
  )
}

function CheckboxIcon({ className }: { className?: string }) {
  const { state } = CheckboxPrimitive.useRootContext()
  return (
    <Icon
      as={state.indeterminate ? MinusIcon : CheckIcon}
      className={cn("size-3.5 text-on-accent", className)}
    />
  )
}

function Checkbox({
  className,
  iconClassName,
  invalid,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root> & {
  iconClassName?: string
  invalid?: boolean
}) {
  return (
    <CheckboxPrimitive.Root
      className={(state) =>
        cn(
          checkboxClassName(state, invalid),
          resolveClassName(className, state)
        )
      }
      hitSlop={HIT_SLOP}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="items-center justify-center">
        <CheckboxIcon className={iconClassName} />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
