import {
  CaretUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "phosphor-react-native"
import * as React from "react"
import {
  Pressable,
  ScrollView,
  type StyleProp,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  View,
  type ViewStyle,
} from "react-native"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type SearchPickerItem = {
  value: string
  label: string
  group?: string
  disabled?: boolean
}

type SearchPickerGroup = {
  value: string
  items: SearchPickerItem[]
}

const styles = StyleSheet.create({
  trigger: {
    height: 44,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 6,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
  },
  triggerText: { flex: 1, ...fontSize.base },
  icon: { flexShrink: 0 },
  body: { paddingHorizontal: 12, paddingTop: 5, paddingBottom: 12 },
  search: {
    height: 56,
    flexShrink: 0,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    paddingHorizontal: 16,
  },
  input: {
    height: "100%",
    minWidth: 0,
    flex: 1,
    paddingVertical: 0,
    ...fontSize.xl,
  },
  list: { padding: 6 },
  empty: { paddingVertical: 40, textAlign: "center", ...fontSize.base },
  spaced: { paddingTop: 8 },
  heading: {
    paddingHorizontal: 12,
    paddingTop: 4,
    paddingBottom: 6,
    ...fontSize.xs,
    fontWeight: "600",
  },
  item: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radius.lg,
    paddingHorizontal: 12,
  },
  itemText: { flex: 1, ...fontSize.base },
})

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function groupItems(items: SearchPickerItem[]): SearchPickerGroup[] {
  const groups = new Map<string, SearchPickerItem[]>()
  for (const item of items) {
    const key = item.group ?? ""
    groups.set(key, [...(groups.get(key) ?? []), item])
  }
  return [...groups].map(([value, groupItems]) => ({
    value,
    items: groupItems,
  }))
}

function SearchPicker({
  items,
  value: valueProp,
  defaultValue,
  onValueChange,
  placeholder,
  searchPlaceholder = "Search...",
  emptyText = "No results found.",
  title,
  disabled,
  floating,
  showCloseButton = false,
  closeLabel,
  invalid,
  style,
  accessibilityLabel,
  accessibilityLabelledBy,
}: {
  items: SearchPickerItem[]
  value?: string | null
  defaultValue?: string | null
  onValueChange?: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  title?: string
  disabled?: boolean
  floating?: boolean
  showCloseButton?: boolean
  closeLabel?: string
  invalid?: boolean
  style?: StyleProp<ViewStyle>
  accessibilityLabel?: string
  accessibilityLabelledBy?: string
}) {
  const { colors, isDark } = useTheme()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? null
  )
  const value = valueProp === undefined ? uncontrolledValue : valueProp
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const { height } = useWindowDimensions()

  const selected = items.find((item) => item.value === value) ?? null
  const groups = React.useMemo(() => {
    const search = query.trim().toLocaleLowerCase()
    const matches = search
      ? items.filter((item) => item.label.toLocaleLowerCase().includes(search))
      : items
    return groupItems(matches)
  }, [items, query])

  const select = (next: string | null) => {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  let triggerColor = selected ? colors.label : colors.labelSecondary
  if (disabled) triggerColor = colors.labelQuaternary

  return (
    <Drawer
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) setQuery("")
      }}
      floating={floating}
      showSwipeHandle
    >
      <DrawerTrigger
        disabled={disabled}
        accessibilityLabel={accessibilityLabel}
        accessibilityLabelledBy={accessibilityLabelledBy}
        style={[
          styles.trigger,
          { backgroundColor: colors.control },
          invalid && {
            borderColor: colors.danger,
            backgroundColor: withAlpha(colors.danger, isDark ? 0.1 : 0.05),
          },
          disabled && { backgroundColor: colors.controlDisabled },
          style,
        ]}
      >
        <Text
          numberOfLines={1}
          style={[
            styles.triggerText,
            {
              color: triggerColor,
            },
          ]}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Icon
          as={CaretUpDownIcon}
          size={16}
          color={disabled ? colors.labelQuaternary : colors.labelSecondary}
          style={styles.icon}
        />
      </DrawerTrigger>
      <DrawerContent
        showCloseButton={showCloseButton}
        closeLabel={closeLabel}
        accessibilityLabel={
          title ? undefined : (placeholder ?? accessibilityLabel)
        }
      >
        {title ? (
          <DrawerHeader>
            <DrawerTitle>{title}</DrawerTitle>
          </DrawerHeader>
        ) : null}
        <View style={styles.body}>
          <View
            style={[
              styles.search,
              { borderBottomColor: colors.separator },
              showCloseButton && { paddingRight: closeLabel ? 84 : 44 },
            ]}
          >
            <Icon
              as={MagnifyingGlassIcon}
              size={22}
              color={colors.labelSecondary}
              style={styles.icon}
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              accessibilityLabel={searchPlaceholder}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              style={[styles.input, { color: colors.label }]}
              placeholderTextColor={colors.labelTertiary}
              cursorColor={colors.accent}
              selectionColor={colors.accent}
            />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ minHeight: height * 0.4, maxHeight: height * 0.6 }}
            contentContainerStyle={styles.list}
          >
            {groups.length === 0 ? (
              <Text style={[styles.empty, { color: colors.labelSecondary }]}>
                {emptyText}
              </Text>
            ) : (
              groups.map((group, index) => (
                <View
                  key={group.value}
                  role="group"
                  accessibilityLabel={group.value || undefined}
                  style={index > 0 ? styles.spaced : undefined}
                >
                  {group.value ? (
                    <Text
                      style={[styles.heading, { color: colors.labelSecondary }]}
                    >
                      {group.value}
                    </Text>
                  ) : null}
                  {group.items.map((item) => {
                    const checked = item.value === value
                    return (
                      <Pressable
                        key={item.value}
                        disabled={item.disabled}
                        accessibilityRole="button"
                        accessibilityState={{
                          selected: checked,
                          disabled: !!item.disabled,
                        }}
                        onPress={() => {
                          select(item.value)
                          setOpen(false)
                          setQuery("")
                        }}
                        style={({ pressed }) => [
                          styles.item,
                          pressed && { backgroundColor: colors.itemPressed },
                        ]}
                      >
                        <Text
                          numberOfLines={1}
                          style={[
                            styles.itemText,
                            {
                              color: item.disabled
                                ? colors.labelQuaternary
                                : colors.label,
                            },
                          ]}
                        >
                          {item.label}
                        </Text>
                        {checked ? (
                          <Icon
                            as={CheckIcon}
                            size={20}
                            color={colors.labelSecondary}
                            style={styles.icon}
                          />
                        ) : null}
                      </Pressable>
                    )
                  })}
                </View>
              ))
            )}
          </ScrollView>
        </View>
      </DrawerContent>
    </Drawer>
  )
}

export { SearchPicker, type SearchPickerItem }
