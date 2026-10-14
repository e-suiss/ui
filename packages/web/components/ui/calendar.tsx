"use client"

import {
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"
import {
  type ChevronProps,
  type DayButtonProps,
  DayPicker,
  getDefaultClassNames,
  type RootProps,
  useDayPicker,
  type WeekNumberProps,
} from "react-day-picker"
import { enUS } from "react-day-picker/locale"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = false,
  captionLayout = "label",
  buttonVariant = "plain",
  size = "default",
  locale = enUS,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker> & {
  buttonVariant?: React.ComponentProps<typeof Button>["variant"]
  size?: "sm" | "default" | "lg"
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      data-size={size}
      showOutsideDays={showOutsideDays}
      className={cn(
        "group/calendar bg-surface p-3 [--cell-radius:calc(infinity*1px)] [--cell-size:--spacing(8)] data-[size=lg]:p-4 data-[size=lg]:[--cell-size:--spacing(10)] data-[size=sm]:p-2 data-[size=sm]:[--cell-size:--spacing(6)] in-data-[slot=card-content]:bg-transparent in-data-[slot=popover-content]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      locale={locale}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString(locale.code, { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn(
          "relative flex flex-col gap-4 md:flex-row",
          defaultClassNames.months
        ),
        month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
        nav: cn(
          "absolute end-0 top-0 flex items-center gap-0.5",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:text-label-quaternary",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "size-(--cell-size) p-0 select-none aria-disabled:text-label-quaternary",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-(--cell-size) w-full items-center justify-start ps-1.5 pe-[calc(var(--cell-size)*2)]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex h-(--cell-size) w-full items-center justify-start gap-1.5 text-sm font-semibold group-data-[size=lg]/calendar:text-base group-data-[size=sm]/calendar:text-xs",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative rounded-(--cell-radius)",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn(
          "absolute inset-0 bg-surface-raised opacity-0",
          defaultClassNames.dropdown
        ),
        caption_label: cn(
          "font-semibold select-none",
          "text-sm group-data-[size=lg]/calendar:text-base group-data-[size=sm]/calendar:text-xs",
          captionLayout !== "label" &&
            "flex items-center gap-1 rounded-(--cell-radius) [&>svg]:size-3.5 [&>svg]:text-label-secondary",
          defaultClassNames.caption_label
        ),
        month_grid: cn("w-full border-collapse", defaultClassNames.month_grid),
        weekdays: cn("flex", defaultClassNames.weekdays),
        weekday: cn(
          "flex-1 rounded-(--cell-radius) text-3xs font-semibold text-label-secondary uppercase select-none group-data-[size=lg]/calendar:text-xs group-data-[size=sm]/calendar:normal-case",
          defaultClassNames.weekday
        ),
        week: cn("mt-2 flex w-full", defaultClassNames.week),
        week_number_header: cn(
          "w-(--cell-size) select-none",
          defaultClassNames.week_number_header
        ),
        week_number: cn(
          "text-xs text-label-secondary select-none",
          defaultClassNames.week_number
        ),
        day: cn(
          "relative aspect-square h-full w-full rounded-(--cell-radius) p-0 text-center select-none [&:last-child[data-selected=true]_button]:rounded-e-(--cell-radius)",
          props.showWeekNumber
            ? "[&:nth-child(2)[data-selected=true]_button]:rounded-s-(--cell-radius)"
            : "[&:first-child[data-selected=true]_button]:rounded-s-(--cell-radius)",
          defaultClassNames.day
        ),
        range_start: cn(
          "relative isolate z-0 rounded-s-(--cell-radius) bg-surface-secondary after:absolute after:inset-y-0 after:end-0 after:w-4 after:bg-surface-secondary last:after:hidden",
          defaultClassNames.range_start
        ),
        range_middle: cn("rounded-none", defaultClassNames.range_middle),
        range_end: cn(
          "relative isolate z-0 rounded-e-(--cell-radius) bg-surface-secondary after:absolute after:inset-y-0 after:start-0 after:w-4 after:bg-surface-secondary first:after:hidden",
          defaultClassNames.range_end
        ),
        today: cn("rounded-(--cell-radius)", defaultClassNames.today),
        outside: cn(
          "text-label-secondary aria-selected:text-label-secondary",
          defaultClassNames.outside
        ),
        disabled: cn("text-label-quaternary", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: CalendarRoot,
        Chevron: CalendarChevron,
        DayButton: CalendarDayButton,
        WeekNumber: CalendarWeekNumber,
        ...components,
      }}
      {...props}
    />
  )
}

function CalendarRoot({ className, rootRef, ...props }: RootProps) {
  return (
    <div
      data-slot="calendar"
      ref={rootRef}
      className={cn(className)}
      {...props}
    />
  )
}

function CalendarChevron({ className, orientation, ...props }: ChevronProps) {
  if (orientation === "left") {
    return (
      <CaretLeftIcon
        className={cn("rtl:rotate-180 size-4", className)}
        {...props}
      />
    )
  }

  if (orientation === "right") {
    return (
      <CaretRightIcon
        className={cn("rtl:rotate-180 size-4", className)}
        {...props}
      />
    )
  }

  return <CaretDownIcon className={cn("size-4", className)} {...props} />
}

function CalendarWeekNumber({ children, week, ...props }: WeekNumberProps) {
  return (
    <td {...props}>
      <div className="flex size-(--cell-size) items-center justify-center text-center">
        {children}
      </div>
    </td>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}: DayButtonProps) {
  const defaultClassNames = getDefaultClassNames()
  const { locale } = useDayPicker().dayPickerProps

  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-today={modifiers.today}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex aspect-square size-auto w-full min-w-(--cell-size) flex-col gap-1 border-0 leading-none font-normal [--focus-ring-offset:0px] group-data-[size=lg]/calendar:text-lg group-data-[size=sm]/calendar:text-3xs data-[today=true]:font-semibold data-[today=true]:text-link data-[selected-single=true]:bg-accent-surface data-[selected-single=true]:font-semibold data-[selected-single=true]:text-link hover:data-[selected-single=true]:bg-accent-surface-hover active:data-[selected-single=true]:bg-accent-surface-pressed data-[today=true]:data-[selected-single=true]:bg-accent data-[today=true]:data-[selected-single=true]:text-on-accent hover:data-[today=true]:data-[selected-single=true]:bg-accent-hover data-[range-end=true]:rounded-(--cell-radius) data-[range-end=true]:rounded-e-(--cell-radius) data-[range-end=true]:bg-accent data-[range-end=true]:text-on-accent data-[range-middle=true]:rounded-none data-[range-middle=true]:bg-surface-secondary data-[range-middle=true]:text-label data-[range-start=true]:rounded-(--cell-radius) data-[range-start=true]:rounded-s-(--cell-radius) data-[range-start=true]:bg-accent data-[range-start=true]:text-on-accent data-[today=true]:data-[range-start=true]:text-on-accent data-[today=true]:data-[range-end=true]:text-on-accent [&>span]:text-xs [&>span]:text-label-secondary",
        defaultClassNames.day,
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
