"use client"

import { CaretUpDownIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/use-mobile"

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
  id,
  className,
  "aria-invalid": ariaInvalid,
  "aria-label": ariaLabel,
  "aria-describedby": ariaDescribedBy,
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
  id?: string
  className?: string
  "aria-invalid"?: boolean
  "aria-label"?: string
  "aria-describedby"?: string
}) {
  const isMobile = useIsMobile()
  const [uncontrolledValue, setUncontrolledValue] = React.useState(
    defaultValue ?? null
  )
  const value = valueProp === undefined ? uncontrolledValue : valueProp
  const [open, setOpen] = React.useState(false)
  const searchRef = React.useRef<HTMLInputElement>(null)

  const groups = React.useMemo(() => groupItems(items), [items])
  const grouped = groups.some((group) => group.value !== "")
  const selected = items.find((item) => item.value === value) ?? null

  const select = (next: string | null) => {
    if (valueProp === undefined) setUncontrolledValue(next)
    onValueChange?.(next)
  }

  if (isMobile) {
    return (
      <Drawer
        data-slot="search-picker"
        open={open}
        onOpenChange={setOpen}
        floating={floating}
        showSwipeHandle
      >
        <DrawerTrigger
          data-slot="search-picker-trigger"
          disabled={disabled}
          id={id}
          aria-invalid={ariaInvalid}
          aria-label={ariaLabel}
          aria-describedby={ariaDescribedBy}
          data-placeholder={selected ? undefined : ""}
          className={cn(
            "flex h-11 w-full items-center justify-between gap-1.5 rounded-lg border border-transparent bg-control px-3 text-start text-base outline-none focus-visible:focus-ring disabled:cursor-not-allowed disabled:bg-control-disabled disabled:text-label-quaternary aria-invalid:border-danger aria-invalid:bg-danger/5 data-placeholder:text-label-secondary dark:aria-invalid:bg-danger/10",
            className
          )}
        >
          <span className="truncate">{selected?.label ?? placeholder}</span>
          <CaretUpDownIcon className="size-4 shrink-0 text-label-secondary" />
        </DrawerTrigger>
        <DrawerContent
          data-slot="search-picker-content"
          initialFocus={searchRef}
          showCloseButton={showCloseButton}
          closeLabel={closeLabel}
        >
          <DrawerHeader className={cn(!title && "sr-only")}>
            <DrawerTitle>{title ?? placeholder ?? ariaLabel}</DrawerTitle>
          </DrawerHeader>
          <Command
            className={cn(
              "rounded-none bg-transparent px-3 pt-1.25 pb-[max(--spacing(3),env(safe-area-inset-bottom))] **:data-[slot=command-list]:max-h-[60dvh] **:data-[slot=command-list]:min-h-[40dvh]",
              showCloseButton && "**:data-[slot=command-input-wrapper]:pe-11",
              showCloseButton &&
                closeLabel &&
                "**:data-[slot=command-input-wrapper]:pe-21"
            )}
          >
            <CommandInput ref={searchRef} placeholder={searchPlaceholder} />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              {groups.map((group) => (
                <CommandGroup
                  key={group.value}
                  heading={group.value || undefined}
                >
                  {group.items.map((item) => (
                    <CommandItem
                      key={item.value}
                      value={item.label}
                      disabled={item.disabled}
                      data-checked={item.value === value}
                      onSelect={() => {
                        select(item.value)
                        setOpen(false)
                      }}
                    >
                      {item.label}
                    </CommandItem>
                  ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Combobox
      data-slot="search-picker"
      items={grouped ? groups : items}
      value={selected}
      onValueChange={(next: SearchPickerItem | null) =>
        select(next?.value ?? null)
      }
      itemToStringLabel={(item: SearchPickerItem) => item.label}
      isItemEqualToValue={(a: SearchPickerItem, b: SearchPickerItem) =>
        a.value === b.value
      }
      disabled={disabled}
    >
      <ComboboxInput
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={ariaInvalid}
        id={id}
        aria-label={ariaLabel}
        aria-describedby={ariaDescribedBy}
        className={className}
      />
      <ComboboxContent data-slot="search-picker-content">
        <ComboboxEmpty>{emptyText}</ComboboxEmpty>
        <ComboboxList>
          {grouped
            ? (group: SearchPickerGroup, index: number) => (
                <ComboboxGroup key={group.value} items={group.items}>
                  {index > 0 && <ComboboxSeparator />}
                  {group.value && <ComboboxLabel>{group.value}</ComboboxLabel>}
                  <ComboboxCollection>
                    {(item: SearchPickerItem) => (
                      <ComboboxItem
                        key={item.value}
                        value={item}
                        disabled={item.disabled}
                      >
                        {item.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxGroup>
              )
            : (item: SearchPickerItem) => (
                <ComboboxItem
                  key={item.value}
                  value={item}
                  disabled={item.disabled}
                >
                  {item.label}
                </ComboboxItem>
              )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export { SearchPicker, type SearchPickerItem }
