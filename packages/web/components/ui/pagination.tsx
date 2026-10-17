"use client"

import type { VariantProps } from "class-variance-authority"
import type * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

function Pagination({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="pagination"
      data-slot="pagination"
      className={cn(
        "cn-pagination mx-auto flex w-full justify-center",
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
      className={cn("cn-pagination-content flex items-center", className)}
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
      data-active={isActive ? "" : undefined}
      className={cn(
        buttonVariants({ variant: isActive ? "secondary" : "ghost", size }),
        "text-sm tabular-nums aria-disabled:pointer-events-none data-active:font-semibold aria-disabled:opacity-50",
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
      <IconPlaceholder
        lucide="ChevronLeftIcon"
        tabler="IconChevronLeft"
        hugeicons="ArrowLeft01Icon"
        phosphor="CaretLeftIcon"
        remixicon="RiArrowLeftSLine"
        data-icon="inline-start"
        className="rtl:rotate-180"
      />
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
      <IconPlaceholder
        lucide="ChevronRightIcon"
        tabler="IconChevronRight"
        hugeicons="ArrowRight01Icon"
        phosphor="CaretRightIcon"
        remixicon="RiArrowRightSLine"
        data-icon="inline-end"
        className="rtl:rotate-180"
      />
    </PaginationLink>
  )
}

function PaginationFirst({
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to first page" {...props}>
      <IconPlaceholder
        lucide="ChevronsLeftIcon"
        tabler="IconChevronsLeft"
        hugeicons="ArrowLeftDoubleIcon"
        phosphor="CaretDoubleLeftIcon"
        remixicon="RiArrowLeftDoubleLine"
        className="rtl:rotate-180"
      />
    </PaginationLink>
  )
}

function PaginationLast({
  ...props
}: React.ComponentProps<typeof PaginationLink>) {
  return (
    <PaginationLink aria-label="Go to last page" {...props}>
      <IconPlaceholder
        lucide="ChevronsRightIcon"
        tabler="IconChevronsRight"
        hugeicons="ArrowRightDoubleIcon"
        phosphor="CaretDoubleRightIcon"
        remixicon="RiArrowRightDoubleLine"
        className="rtl:rotate-180"
      />
    </PaginationLink>
  )
}

function PaginationEllipsis({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="pagination-ellipsis"
      className={cn(
        "cn-pagination-ellipsis flex items-center justify-center [&_svg:not([class*='size-'])]:size-4",
        className
      )}
      {...props}
    >
      <IconPlaceholder
        lucide="EllipsisIcon"
        tabler="IconDots"
        hugeicons="MoreHorizontalIcon"
        phosphor="DotsThreeIcon"
        remixicon="RiMoreLine"
        aria-hidden
      />
      <span className="sr-only">More pages</span>
    </span>
  )
}

function PaginationSummary({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="pagination-summary"
      className={cn("cn-pagination-summary", className)}
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
        "cn-pagination-group *:w-10 *:rounded-none *:border-0 *:bg-secondary *:hover:bg-secondary/80 *:focus-visible:ring-inset *:focus-visible:relative *:focus-visible:z-10",
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
      className={cn("cn-pagination-input", className)}
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
