"use client"

import type * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { cn } from "@/lib/utils"

function Breadcrumb({ className, ...props }: React.ComponentProps<"nav">) {
  return (
    <nav
      aria-label="breadcrumb"
      data-slot="breadcrumb"
      className={className}
      {...props}
    />
  )
}

function BreadcrumbList({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="breadcrumb-list"
      className={cn(
        "cn-breadcrumb-list flex flex-wrap items-center wrap-break-word",
        className
      )}
      {...props}
    />
  )
}

function BreadcrumbItem({ className, ...props }: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-item"
      className={cn("cn-breadcrumb-item inline-flex items-center", className)}
      {...props}
    />
  )
}

function BreadcrumbLink({
  className,
  render,
  ...props
}: React.ComponentProps<"a"> & {
  render?: (props: React.HTMLAttributes<HTMLElement>) => React.ReactNode
}) {
  const merged = {
    "data-slot": "breadcrumb-link",
    className: cn(
      "rounded-xs outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg:not([class*='size-'])]:size-4.5",
      className
    ),
    ...props,
  }
  if (render) return render(merged as React.HTMLAttributes<HTMLElement>)
  return <a {...merged} />
}

function BreadcrumbPage({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-page"
      aria-current="page"
      className={cn("cn-breadcrumb-page", className)}
      {...props}
    />
  )
}

function BreadcrumbSeparator({
  children,
  className,
  ...props
}: React.ComponentProps<"li">) {
  return (
    <li
      data-slot="breadcrumb-separator"
      role="presentation"
      aria-hidden="true"
      className={cn("cn-breadcrumb-separator [&>svg]:size-3", className)}
      {...props}
    >
      {children ?? (
        <IconPlaceholder
          lucide="ChevronRightIcon"
          tabler="IconChevronRight"
          hugeicons="ArrowRight01Icon"
          phosphor="CaretRightIcon"
          remixicon="RiArrowRightSLine"
          className="rtl:rotate-180"
        />
      )}
    </li>
  )
}

function BreadcrumbEllipsis({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="breadcrumb-ellipsis"
      className={cn(
        "cn-breadcrumb-ellipsis flex items-center justify-center [&>svg]:size-4",
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
        aria-hidden="true"
      />
      <span className="sr-only">{children ?? "More"}</span>
    </span>
  )
}

export {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
}
