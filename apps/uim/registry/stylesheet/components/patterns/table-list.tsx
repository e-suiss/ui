import * as React from "react"
import { StyleSheet, View, type ViewProps } from "react-native"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type TableListColumn<T> = {
  key: string
  header: React.ReactNode
  cell: (row: T) => React.ReactNode
  mobileCell?: (row: T) => React.ReactNode
  slot?: "title" | "description" | "trailing" | "hidden"
  align?: "start" | "end"
}

const styles = StyleSheet.create({
  root: { flexDirection: "column", gap: 12 },
  title: { ...fontSize["3xl"], fontWeight: "700" },
  header: {
    ...fontSize.sm,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 6,
    textTransform: "uppercase",
  },
  footer: {
    ...fontSize.sm,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 8,
  },
  separator: { marginStart: 16, height: 1 },
  row: {
    minHeight: 44,
    flexWrap: "nowrap",
    gap: 16,
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  first: {
    borderTopLeftRadius: radius["2xl"],
    borderTopRightRadius: radius["2xl"],
  },
  last: {
    borderBottomLeftRadius: radius["2xl"],
    borderBottomRightRadius: radius["2xl"],
  },
  rowContent: { gap: 2 },
  trailing: {
    ...fontSize.base,
    flexShrink: 0,
    fontVariant: ["tabular-nums"],
  },
  empty: {
    borderRadius: radius["2xl"],
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  list: { overflow: "hidden", borderRadius: radius["2xl"] },
})

function isText(node: React.ReactNode) {
  return typeof node === "string" || typeof node === "number"
}

function TableListTitle({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      role="heading"
      style={[styles.title, { color: colors.label }, style]}
      {...props}
    />
  )
}

function TableListHeader({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      role="heading"
      style={[styles.header, { color: colors.labelSecondary }, style]}
      {...props}
    />
  )
}

function TableListFooter({
  style,
  ...props
}: React.ComponentProps<typeof Text>) {
  const { colors } = useTheme()
  return (
    <Text
      style={[styles.footer, { color: colors.labelSecondary }, style]}
      {...props}
    />
  )
}

function TableListSeparator({ style, ...props }: ViewProps) {
  const { colors } = useTheme()
  return (
    <View
      accessible={false}
      importantForAccessibility="no"
      style={[{ backgroundColor: colors.surfaceSecondary }, style]}
      {...props}
    >
      <View style={[styles.separator, { backgroundColor: colors.separator }]} />
    </View>
  )
}

function TableListRow({
  title,
  description,
  trailing,
  first = false,
  last = false,
  style,
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
  const { colors } = useTheme()
  return (
    <Item
      size="sm"
      style={(state) => [
        styles.row,
        {
          backgroundColor: state.pressed
            ? colors.surfaceTertiary
            : colors.surfaceSecondary,
        },
        first && styles.first,
        last && styles.last,
        typeof style === "function" ? style(state) : style,
      ]}
      {...props}
    >
      {children ?? (
        <>
          <ItemContent style={styles.rowContent}>
            {title != null ? (
              <ItemTitle style={{ fontWeight: "400" }}>{title}</ItemTitle>
            ) : null}
            {description != null ? (
              <ItemDescription numberOfLines={1}>{description}</ItemDescription>
            ) : null}
          </ItemContent>
          {trailing != null ? (
            <ItemActions>
              {isText(trailing) ? (
                <Text
                  style={[styles.trailing, { color: colors.labelSecondary }]}
                >
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
  style,
  ...props
}: ViewProps & {
  rows: T[]
  columns: TableListColumn<T>[]
  getKey?: (row: T, index: number) => React.Key
  title?: React.ReactNode
  emptyText?: React.ReactNode
  onRowPress?: (row: T, index: number) => void
}) {
  const { colors } = useTheme()
  const titleColumn = columns.find((column) => column.slot === "title")
  const trailing = columns.filter((column) => column.slot === "trailing")
  const description = columns.filter((column) => column.slot === "description")
  const mobileCell = (column: TableListColumn<T>, row: T) =>
    (column.mobileCell ?? column.cell)(row)

  return (
    <View style={[styles.root, style]} {...props}>
      {title != null ? <TableListTitle>{title}</TableListTitle> : null}
      {rows.length === 0 ? (
        <View
          style={[styles.empty, { backgroundColor: colors.surfaceSecondary }]}
        >
          {isText(emptyText) ? (
            <Text style={{ ...fontSize.base, color: colors.labelSecondary }}>
              {emptyText}
            </Text>
          ) : (
            emptyText
          )}
        </View>
      ) : (
        <View role="list" style={styles.list}>
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
                            style={[
                              styles.trailing,
                              { color: colors.labelSecondary },
                            ]}
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
