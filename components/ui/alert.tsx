import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type * as React from "react"

const alertVariants = cva(
  "group/alert relative grid w-full gap-0.5 rounded-2xl p-5 text-start text-base has-data-[slot=alert-action]:pe-24 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-3 has-data-[slot=alert-description]:*:[svg]:row-span-2 *:[svg]:translate-y-px *:[svg:not([class*='size-'])]:size-5",
  {
    variants: {
      variant: {
        default: "bg-muted text-foreground *:[svg]:text-primary",
        destructive: "bg-muted text-destructive *:[svg]:text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  )
}

function AlertTitle({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-title"
      className={cn(
        "font-semibold group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:hover:text-foreground",
        className
      )}
      {...props}
    />
  )
}

function AlertDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-description"
      className={cn(
        "text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
        className
      )}
      {...props}
    />
  )
}

function AlertAction({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="alert-action"
      className={cn("absolute top-4 inset-e-4", className)}
      {...props}
    />
  )
}

export { Alert, AlertAction, AlertDescription, AlertTitle }
