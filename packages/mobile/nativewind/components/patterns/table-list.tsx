import { cn } from "cn"
import * as React from "react"
import { View, type ViewProps } from "react-native"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"

type TableListColumn<T> = {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  mobileCell?: (row: T) => React.ReactNode
  slot?: "title" | "description" | "trailing" | "hidden"
  align?: "start" | "end"
}

function isText(node: React.ReactNode) {
  return typeof node === "string" || typeof node === "number"
}

function TableListTitle({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      className={cn("text-3xl font-bold text-foreground", className)}
      {...props}
    />
  )
}

function TableListHeader({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      role="heading"
      className={cn(
        "px-4 pt-4 pb-1.5 text-sm text-muted-foreground uppercase",
        className
      )}
      {...props}
    />
  )
}

function TableListFooter({
  className,
  ...props
}: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn(
        "px-4 pt-1.5 pb-2 text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

function TableListSeparator({ className, ...props }: ViewProps) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      className={cn("bg-muted", className)}
      {...props}
    >
      <View className="ms-4 h-px bg-border" />
    </View>
  )
}

function TableListRow({
  title,
  description,
  trailing,
  first = false,
  last = false,
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof Item>, "children"> & {
  title?: React.ReactNode
  description?: React.ReactNode
  trailing?: React.ReactNode
  first?: boolean
  last?: boolean
  children?: React.ReactNode
}) {
  return (
    <Item
      size="sm"
      className={cn(
        "min-h-11 flex-nowrap gap-4 rounded-none bg-muted px-4 py-[0.6875rem] active:opacity-80",
        first && "rounded-t-2xl",
        last && "rounded-b-2xl",
        className
      )}
      {...props}
    >
      {children ?? (
        <>
          <ItemContent className="gap-0.5">
            {title != null ? (
              <ItemTitle className="font-normal">{title}</ItemTitle>
            ) : null}
            {description != null ? (
              <ItemDescription numberOfLines={1}>{description}</ItemDescription>
            ) : null}
          </ItemContent>
          {trailing != null ? (
            <ItemActions>
              {isText(trailing) ? (
                <Text className="text-base text-muted-foreground tabular-nums">
                  {trailing}
                </Text>
              ) : (
                trailing
              )}
            </ItemActions>
          ) : null}
        </>
      )}
    </Item>
  )
}

function TableList<T>({
  rows,
  columns,
  getKey = (_, index) => index,
  title,
  emptyText = "No results.",
  onRowPress,
  className,
  ...props
}: ViewProps & {
  rows: T[]
  columns: TableListColumn<T>[]
  getKey?: (row: T, index: number) => React.Key
  title?: React.ReactNode
  emptyText?: React.ReactNode
  onRowPress?: (row: T, index: number) => void
}) {
  const titleColumn = columns.find((column) => column.slot === "title")
  const trailing = columns.filter((column) => column.slot === "trailing")
  const description = columns.filter((column) => column.slot === "description")
  const mobileCell = (column: TableListColumn<T>, row: T) =>
    (column.mobileCell ?? column.cell)(row)

  return (
    <View className={cn("flex-col gap-3", className)} {...props}>
      {title != null ? <TableListTitle>{title}</TableListTitle> : null}
      {rows.length === 0 ? (
        <View className="rounded-2xl bg-muted px-4 py-3">
          {isText(emptyText) ? (
            <Text className="text-base text-muted-foreground">{emptyText}</Text>
          ) : (
            emptyText
          )}
        </View>
      ) : (
        <View role="list" className="overflow-hidden rounded-2xl">
          {rows.map((row, index) => (
            <React.Fragment key={getKey(row, index)}>
              {index > 0 ? <TableListSeparator /> : null}
              <TableListRow
                role={onRowPress ? "button" : "listitem"}
                onPress={onRowPress ? () => onRowPress(row, index) : undefined}
                title={titleColumn ? mobileCell(titleColumn, row) : undefined}
                description={
                  description.length > 0
                    ? description.map((column, position) => (
                        <React.Fragment key={column.key}>
                          {position > 0 ? " · " : null}
                          {mobileCell(column, row)}
                        </React.Fragment>
                      ))
                    : undefined
                }
                trailing={
                  trailing.length > 0
                    ? trailing.map((column) => {
                        const cell = mobileCell(column, row)
                        return isText(cell) ? (
                          <Text
                            key={column.key}
                            className="shrink-0 text-base text-muted-foreground tabular-nums"
                          >
                            {cell}
                          </Text>
                        ) : (
                          <React.Fragment key={column.key}>
                            {cell}
                          </React.Fragment>
                        )
                      })
                    : undefined
                }
              />
            </React.Fragment>
          ))}
        </View>
      )}
    </View>
  )
}

export {
  TableList,
  type TableListColumn,
  TableListFooter,
  TableListHeader,
  TableListRow,
  TableListSeparator,
  TableListTitle,
}
