import { cn } from "cn"
import { cssInterop } from "nativewind"
import {
  CaretUpDownIcon,
  CheckIcon,
  MagnifyingGlassIcon,
} from "phosphor-react-native"
import * as React from "react"
import {
  Pressable,
  ScrollView,
  TextInput,
  useWindowDimensions,
  View,
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

declare module "react-native" {
  interface TextInputProps {
    cursorColorClassName?: string
    selectionColorClassName?: string
  }
}

cssInterop(TextInput, {
  className: { target: "style", nativeStyleToProp: { textAlign: true } },
  placeholderClassName: {
    target: false,
    nativeStyleToProp: { color: "placeholderTextColor" },
  },
  cursorColorClassName: {
    target: false,
    nativeStyleToProp: { color: "cursorColor" },
  },
  selectionColorClassName: {
    target: false,
    nativeStyleToProp: { color: "selectionColor" },
  },
})

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
  className,
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
  className?: string
  accessibilityLabel?: string
  accessibilityLabelledBy?: string
}) {
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
        className={cn(
          "h-11 w-full flex-row items-center justify-between gap-1.5 rounded-lg border border-transparent bg-control px-3",
          invalid && "border-danger bg-danger-5 dark:bg-danger-10",
          disabled && "bg-control-disabled",
          className
        )}
      >
        <Text
          numberOfLines={1}
          className={cn(
            "flex-1 text-base text-label",
            !selected && "text-label-secondary",
            disabled && "text-label-quaternary"
          )}
        >
          {selected?.label ?? placeholder}
        </Text>
        <Icon
          as={CaretUpDownIcon}
          className={cn(
            "size-4 shrink-0 text-label-secondary",
            disabled && "text-label-quaternary"
          )}
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
        <View className="px-3 pt-[0.3125rem] pb-3">
          <View
            className={cn(
              "h-14 shrink-0 flex-row items-center gap-3 border-b border-separator px-4",
              showCloseButton && "pr-11",
              showCloseButton && closeLabel && "pr-[5.25rem]"
            )}
          >
            <Icon
              as={MagnifyingGlassIcon}
              className="size-[1.375rem] shrink-0 text-label-secondary"
            />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder={searchPlaceholder}
              accessibilityLabel={searchPlaceholder}
              autoCorrect={false}
              autoCapitalize="none"
              returnKeyType="search"
              className="h-full min-w-0 flex-1 py-0 text-xl text-label"
              placeholderClassName="text-label-tertiary"
              cursorColorClassName="text-accent"
              selectionColorClassName="text-accent"
            />
          </View>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={{ minHeight: height * 0.4, maxHeight: height * 0.6 }}
            contentContainerClassName="p-1.5"
          >
            {groups.length === 0 ? (
              <Text className="py-10 text-center text-base text-label-secondary">
                {emptyText}
              </Text>
            ) : (
              groups.map((group, index) => (
                <View
                  key={group.value}
                  role="group"
                  accessibilityLabel={group.value || undefined}
                  className={cn(index > 0 && "pt-2")}
                >
                  {group.value ? (
                    <Text className="px-3 pt-1 pb-1.5 text-xs font-semibold text-label-secondary">
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
                        className="h-10 flex-row items-center gap-3 rounded-lg px-3 active:bg-item-pressed"
                      >
                        <Text
                          numberOfLines={1}
                          className={cn(
                            "flex-1 text-base text-label",
                            item.disabled && "text-label-quaternary"
                          )}
                        >
                          {item.label}
                        </Text>
                        {checked ? (
                          <Icon
                            as={CheckIcon}
                            className="size-5 shrink-0 text-label-secondary"
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
