"use client"

import { cva, type VariantProps } from "class-variance-authority"
import {
  createContext,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

function FieldSet({ className, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset
      data-slot="field-set"
      className={cn(
        "cn-field-set flex flex-col has-[>[data-variant=inset]]:*:data-[slot=field-description]:ps-4 has-[>[data-variant=inset]]:*:data-[slot=field-description]:text-xs has-[>[data-variant=inset]]:*:data-[slot=field-legend]:mb-0 has-[>[data-variant=inset]]:*:data-[slot=field-legend]:ps-4 has-[>[data-variant=inset]]:*:data-[slot=field-legend]:text-xs has-[>[data-variant=inset]]:*:data-[slot=field-legend]:font-normal has-[>[data-variant=inset]]:*:data-[slot=field-legend]:text-muted-foreground has-[>[data-variant=inset]]:*:data-[slot=field-legend]:uppercase",
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
      className={cn("cn-field-legend", className)}
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
        "cn-field-group group/field-group @container/field-group flex w-full flex-col *:data-[slot=field-group]:gap-4",
        "data-[variant=inset]:gap-0 data-[variant=inset]:rounded-2xl data-[variant=inset]:bg-muted data-[variant=inset]:*:data-[slot=field]:relative data-[variant=inset]:*:data-[slot=field]:min-h-11 data-[variant=inset]:*:data-[slot=field]:px-4 data-[variant=inset]:*:data-[slot=field]:py-1.5 data-[variant=inset]:*:data-[slot=field]:not-first:before:absolute data-[variant=inset]:*:data-[slot=field]:not-first:before:inset-e-0 data-[variant=inset]:*:data-[slot=field]:not-first:before:inset-s-4 data-[variant=inset]:*:data-[slot=field]:not-first:before:top-0 data-[variant=inset]:*:data-[slot=field]:not-first:before:h-px data-[variant=inset]:*:data-[slot=field]:not-first:before:bg-border",
        "data-[variant=inset]:**:data-[slot=field-label]:font-normal data-[variant=inset]:**:data-[slot=input]:h-8 data-[variant=inset]:**:data-[slot=input]:bg-transparent data-[variant=inset]:**:data-[slot=input]:px-0 data-[variant=inset]:**:data-[slot=input]:text-end data-[variant=inset]:**:data-[slot=input]:outline-none!",
        className
      )}
      {...props}
    />
  )
}

const fieldVariants = cva("cn-field group/field flex", {
  variants: {
    orientation: {
      vertical: "cn-field-orientation-vertical *:w-full [&>.sr-only]:w-auto",
      horizontal:
        "cn-field-orientation-horizontal *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.75",
      responsive:
        "cn-field-orientation-responsive *:w-full @md/field-group:*:w-auto @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-0.75",
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

const FieldLabelContext = createContext(false)

function Field({
  className,
  orientation = "vertical",
  ref,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof fieldVariants>) {
  const inLabel = useContext(FieldLabelContext)
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
      role={inLabel ? undefined : "group"}
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
      className={cn(
        "cn-field-content flex flex-1 flex-col group/field-content",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<typeof Label>) {
  return (
    <FieldLabelContext.Provider value>
      <Label
        data-slot="field-label"
        className={cn(
          "cn-field-label group/field-label flex w-fit peer/field-label *:data-[slot=field]:p-4",
          "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col",
          className
        )}
        {...props}
      />
    </FieldLabelContext.Provider>
  )
}

function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="field-label"
      className={cn("cn-field-title flex w-fit items-center", className)}
      {...props}
    />
  )
}

function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="field-description"
      className={cn(
        "cn-field-description font-normal group-has-data-horizontal/field:text-balance",
        "last:mt-0 nth-last-2:-mt-1",
        "[&>a]:text-primary [&>a]:underline [&>a]:underline-offset-2",
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
      className={cn("cn-field-separator relative", className)}
      {...props}
    >
      <Separator className="absolute inset-0 top-1/2" />
      {children && (
        <span
          className="cn-field-separator-content relative mx-auto block w-fit bg-background"
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
      className={cn("cn-field-error font-normal", className)}
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
