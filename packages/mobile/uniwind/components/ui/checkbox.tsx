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
      ? "border-primary bg-primary"
      : cn(
          "border-foreground/25 bg-background shadow-xs dark:border-transparent dark:bg-border dark:shadow-none",
          invalid && "border-destructive dark:border-destructive"
        ),
    state.disabled ? "opacity-50" : "active:opacity-80"
  )
}

function CheckboxIcon({ className }: { className?: string }) {
  const { state } = CheckboxPrimitive.useRootContext()
  return (
    <Icon
      as={state.indeterminate ? MinusIcon : CheckIcon}
      className={cn("size-3.5 text-primary-foreground", className)}
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
