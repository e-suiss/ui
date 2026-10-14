"use client"

import {
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  DotsThreeIcon,
} from "@phosphor-icons/react"
import type { VariantProps } from "class-variance-authority"
import { cn } from "cn"
import type * as React from "react"
import { buttonVariants } from "@/components/ui/button"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn(
        "mx-auto flex w-full items-center justify-center gap-3",
        className
      )}
      {...props}
    />
  )
}

function PaginationContent({
  className,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="pagination-content"
      className={cn("flex items-center gap-1", className)}
      {...props}
    />
  )
}

function PaginationItem({ ...props }: React.ComponentProps<"li">) {
  return <li data-slot="pagination-item" {...props} />
}

type PaginationLinkProps = {
  isActive?: boolean
} & Pick<VariantProps<typeof buttonVariants>, "size"> &
  React.ComponentProps<"a">

function PaginationLink({
  className,
  isActive,
  size = "icon-sm",
  ...props
}: PaginationLinkProps) {
  return (
    <a
      aria-current={isActive ? "page" : undefined}
      data-slot="pagination-link"
      data-active={isActive}
      className={cn(
        buttonVariants({ variant: isActive ? "secondary" : "ghost", size }),
        "text-sm tabular-nums aria-disabled:pointer-events-none aria-disabled:text-label-quaternary data-active:font-semibold",
        className
      )}
      {...props}
    />
  )
}

function PaginationPrevious({
  className,
  text = "Previous",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label={text && text !== "Previous" ? text : "Go to previous page"}
      size={text ? "sm" : "icon-sm"}
      className={cn(text && "ps-2!", className)}
      {...props}
    >
      <CaretLeftIcon data-icon="inline-start" className="rtl:rotate-180" />
      {text && <span className="hidden sm:block">{text}</span>}
    </PaginationLink>
  )
}

function PaginationNext({
  className,
  text = "Next",
  ...props
}: React.ComponentProps<typeof PaginationLink> & { text?: string }) {
  return (
    <PaginationLink
      aria-label={text && text !== "Next" ? text : "Go to next page"}
      size={text ? "sm" : "icon-sm"}
      className={cn(text && "pe-2!", className)}
      {...props}
    >
      {text && <span className="hidden sm:block">{text}</span>}
      <CaretRightIcon data-icon="inline-end" className="rtl:rotate-180" />
    </PaginationLink>
  )
}

function PaginationFirst({
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to first page" {...props}>
      <CaretDoubleLeftIcon className="rtl:rotate-180" />
    </PaginationLink>
  )
}

function PaginationLast({
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to last page" {...props}>
      <CaretDoubleRightIcon className="rtl:rotate-180" />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn(
        "flex size-8 items-center justify-center text-label-secondary [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <DotsThreeIcon />
      <span className="sr-only">More pages</span>
    </span>
  )
}

function PaginationSummary({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="pagination-summary"
      className={cn(
        "text-sm whitespace-nowrap text-label-secondary tabular-nums",
        className
      )}
      {...props}
    />
  )
}

function PaginationGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      role="group"
      data-slot="pagination-group"
      className={cn(
        "flex items-center gap-px overflow-hidden rounded-lg *:w-10 *:rounded-none *:border-0 *:bg-control *:hover:bg-control-hover *:active:bg-control-pressed *:[--focus-ring-offset:-3px] *:focus-visible:relative *:focus-visible:z-10",
        className
      )}
      {...props}
    />
  )
}

function PaginationInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  return (
    <input
      type="text"
      inputMode="numeric"
      data-slot="pagination-input"
      className={cn(
        "h-8 w-12 rounded-md bg-control text-center text-sm font-semibold text-label tabular-nums caret-accent outline-none focus-visible:focus-ring",
        className
      )}
      {...props}
    />
  )
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationGroup,
  PaginationInput,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationSummary,
}
