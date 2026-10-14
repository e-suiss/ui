"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { useId, useLayoutEffect, useMemo, useRef } from "react"

import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "flex flex-col gap-6 has-[>[data-slot=radio-group]]:gap-3 has-[>[data-variant=inset]]:gap-2 has-[>[data-variant=inset]]:*:data-[slot=field-description]:ps-4 has-[>[data-variant=inset]]:*:data-[slot=field-description]:text-xs has-[>[data-variant=inset]]:*:data-[slot=field-legend]:mb-0 has-[>[data-variant=inset]]:*:data-[slot=field-legend]:ps-4 has-[>[data-variant=inset]]:*:data-[slot=field-legend]:text-xs has-[>[data-variant=inset]]:*:data-[slot=field-legend]:font-normal has-[>[data-variant=inset]]:*:data-[slot=field-legend]:text-label-secondary has-[>[data-variant=inset]]:*:data-[slot=field-legend]:uppercase",
        className
      )}
      {...props}
    />
  )
}

function FieldLegend({
  className,
  variant = "legend",
  ...props
}: React.ComponentProps<"legend"> & { variant?: "legend" | "label" }) {
  return (
    <legend
      data-slot="field-legend"
      data-variant={variant}
      className={cn(
        "mb-3 font-semibold data-[variant=label]:text-base data-[variant=legend]:text-base",
        className
      )}
      {...props}
    />
  )
}

function FieldGroup({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & { variant?: "default" | "inset" }) {
  return (
    <div
      data-slot="field-group"
      data-variant={variant}
      className={cn(
        "group/field-group @container/field-group flex w-full flex-col gap-7 *:data-[slot=field-group]:gap-4",
        "data-[variant=inset]:gap-0 data-[variant=inset]:rounded-2xl data-[variant=inset]:bg-surface-secondary data-[variant=inset]:*:data-[slot=field]:relative data-[variant=inset]:*:data-[slot=field]:min-h-11 data-[variant=inset]:*:data-[slot=field]:px-4 data-[variant=inset]:*:data-[slot=field]:py-1.5 data-[variant=inset]:*:data-[slot=field]:not-first:before:absolute data-[variant=inset]:*:data-[slot=field]:not-first:before:inset-e-0 data-[variant=inset]:*:data-[slot=field]:not-first:before:inset-s-4 data-[variant=inset]:*:data-[slot=field]:not-first:before:top-0 data-[variant=inset]:*:data-[slot=field]:not-first:before:h-px data-[variant=inset]:*:data-[slot=field]:not-first:before:bg-separator",
        "data-[variant=inset]:**:data-[slot=field-label]:font-normal data-[variant=inset]:**:data-[slot=input]:h-8 data-[variant=inset]:**:data-[slot=input]:bg-transparent data-[variant=inset]:**:data-[slot=input]:px-0 data-[variant=inset]:**:data-[slot=input]:text-end data-[variant=inset]:**:data-[slot=input]:outline-none!",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("group/field flex w-full gap-3", {
  variants: {
    orientation: {
      vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
      horizontal:
        "flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.75",
      responsive:
        "flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.75",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
})

const FIELD_CONTROL =
  "input:not([type=hidden]):not([aria-hidden=true]), textarea, select, [role=checkbox], [role=switch], [role=radiogroup], [role=radio], [role=slider], [role=combobox], [role=spinbutton]"
const FIELD_NOTE = "[data-slot=field-description], [data-slot=field-error]"
const WHITESPACE = /\s+/

function Field({
  className,
  orientation = "vertical",
  ref,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  const fieldRef = useRef<HTMLDivElement | null>(null)
  const linkedRef = useRef<string[]>([])
  const noteId = useId()

  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    const own = (element: Element) =>
      element.closest("[data-slot=field]") === field
    const link = () => {
      const control = Array.from(field.querySelectorAll(FIELD_CONTROL)).find(
        own
      )
      const notes = Array.from(
        field.querySelectorAll<HTMLElement>(FIELD_NOTE)
      ).filter(own)
      const ids = notes.map((note, index) => {
        if (!note.id) note.id = `${noteId}-${index}`
        return note.id
      })
      if (!control) return
      const kept = (control.getAttribute("aria-describedby") ?? "")
        .split(WHITESPACE)
        .filter((id) => id && !linkedRef.current.includes(id))
      const next = [...kept, ...ids.filter((id) => !kept.includes(id))]
      linkedRef.current = ids
      if (next.length) control.setAttribute("aria-describedby", next.join(" "))
      else control.removeAttribute("aria-describedby")
    }
    link()
    const observer = new MutationObserver(link)
    observer.observe(field, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [noteId])

  return (
    <div
      ref={(node) => {
        fieldRef.current = node
        if (typeof ref === "function") return ref(node)
        if (ref) ref.current = node
      }}
      role="group"
      data-slot="field"
      data-orientation={orientation}
      className={cn(fieldVariants({ orientation }), className)}
      {...props}
    />
  )
}

function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-content"
      className={cn("flex flex-1 flex-col gap-1", className)}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <Label
      data-slot="field-label"
      className={cn(
        "group/field-label flex w-fit gap-2 group-data-[disabled=true]/field:text-label-quaternary has-[>[data-slot=field]]:has-data-checked:border-accent has-[>[data-slot=field]]:has-data-checked:ring-1 has-[>[data-slot=field]]:has-data-checked:ring-accent has-[>[data-slot=field]]:rounded-xl has-[>[data-slot=field]]:border has-[>[data-slot=field]]:not-has-[:disabled,[data-disabled]]:hover:bg-item-hover has-[>[data-slot=field]]:has-focus-visible:focus-ring *:data-[slot=field]:p-4",
        "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
        className
      )}
      {...props}
    />
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn(
        "flex w-fit items-center gap-2 text-base font-semibold group-data-[disabled=true]/field:text-label-quaternary",
        className
      )}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "text-start text-sm font-normal text-label-secondary group-has-data-horizontal/field:text-balance [[data-variant=legend]+&]:-mt-1.5",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:text-link [&>a]:underline [&>a]:underline-offset-2",
        className
      )}
      {...props}
    />
  )
}

function FieldSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"div"> & {
  children?: React.ReactNode
}) {
  return (
    <div
      data-slot="field-separator"
      data-content={!!children}
      className={cn(
        "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2",
        className
      )}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="relative mx-auto block w-fit bg-surface px-2 text-label-secondary"
          data-slot="field-separator-content"
        >
          {children}
        </span>
      )}
    </div>
  )
}

function FieldError({
  className,
  children,
  errors,
  ...props
}: React.ComponentProps<"div"> & {
  errors?: Array<{ message?: string } | undefined>
}) {
  const content = useMemo(() => {
    if (children) {
      return children
    }

    if (!errors?.length) {
      return null
    }

    const uniqueErrors = [
      ...new Map(errors.map((error) => [error?.message, error])).values(),
    ]

    if (uniqueErrors?.length === 1) {
      return uniqueErrors[0]?.message
    }

    return (
      <ul className="ms-4 flex list-disc flex-col gap-1">
        {uniqueErrors.map(
          (error) =>
            error?.message && <li key={error.message}>{error.message}</li>
        )}
      </ul>
    )
  }, [children, errors])

  if (!content) {
    return null
  }

  return (
    <div
      role="alert"
      data-slot="field-error"
      className={cn("text-sm font-normal text-danger", className)}
      {...props}
    >
      {content}
    </div>
  )
}

export {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
}
