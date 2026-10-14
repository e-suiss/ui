"use client"

import { cn } from "cn"
import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useIsMobile } from "@/hooks/use-mobile"

type TableListColumn<T> = {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  mobileCell?: (row: T) => React.ReactNode
  slot?: "title" | "description" | "trailing" | "hidden"
  align?: "start" | "end"
}

function TableList<T>({
  rows,
  columns,
  getKey = (_, index) => index,
  title,
  emptyText = "No results.",
  className,
  ...props
}: Omit<React.ComponentProps<"section">, "title"> & {
  rows: T[]
  columns: TableListColumn<T>[]
  getKey?: (row: T, index: number) => React.Key
  title?: React.ReactNode
  emptyText?: React.ReactNode
}) {
  const isMobile = useIsMobile()
  const titleId = React.useId()

  if (isMobile) {
    const titleColumn = columns.find((column) => column.slot === "title")
    const trailing = columns.filter((column) => column.slot === "trailing")
    const description = columns.filter(
      (column) => column.slot === "description"
    )
    const mobileCell = (column: TableListColumn<T>, row: T) =>
      (column.mobileCell ?? column.cell)(row)

    return (
      <section
        data-slot="table-list"
        aria-labelledby={title ? titleId : undefined}
        className={cn("flex flex-col gap-3", className)}
        {...props}
      >
        {title && (
          <h2
            id={titleId}
            data-slot="table-list-title"
            className="text-3xl font-bold tracking-tight"
          >
            {title}
          </h2>
        )}
        {rows.length === 0 ? (
          <p className="rounded-2xl bg-surface-secondary px-4 py-3 text-base text-label-secondary">
            {emptyText}
          </p>
        ) : (
          <ul
            data-slot="table-list-items"
            className="overflow-hidden rounded-2xl bg-surface-secondary"
          >
            {rows.map((row, index) => (
              <li
                key={getKey(row, index)}
                data-slot="table-list-item"
                className="ms-4 flex min-h-11 items-center gap-4 py-2.75 pe-4 not-first:border-t not-first:border-separator"
              >
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  {titleColumn && (
                    <span className="truncate text-base text-label">
                      {mobileCell(titleColumn, row)}
                    </span>
                  )}
                  {description.length > 0 && (
                    <span className="truncate text-sm text-label-secondary">
                      {description.map((column, position) => (
                        <React.Fragment key={column.key}>
                          {position > 0 && " · "}
                          {mobileCell(column, row)}
                        </React.Fragment>
                      ))}
                    </span>
                  )}
                </div>
                {trailing.map((column) => (
                  <span
                    key={column.key}
                    className="shrink-0 text-base text-label-secondary tabular-nums"
                  >
                    {mobileCell(column, row)}
                  </span>
                ))}
              </li>
            ))}
          </ul>
        )}
      </section>
    )
  }

  return (
    <section
      data-slot="table-list"
      aria-labelledby={title ? titleId : undefined}
      className={cn("overflow-hidden rounded-2xl border", className)}
      {...props}
    >
      {title && (
        <h2
          id={titleId}
          data-slot="table-list-title"
          className="border-b px-6 py-4 text-base font-semibold"
        >
          {title}
        </h2>
      )}
      <div className="px-3 pb-2">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead
                  key={column.key}
                  className={cn(column.align === "end" && "text-end")}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center text-label-secondary"
                >
                  {emptyText}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row, index) => (
                <TableRow key={getKey(row, index)}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(column.align === "end" && "text-end")}
                    >
                      {column.cell(row)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  )
}

export { TableList, type TableListColumn }
