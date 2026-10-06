"use client"

import { CheckIcon } from "@phosphor-icons/react"
import { cn } from "cn"
import * as React from "react"

import { Button } from "@/components/ui/button"

type SelectionListContextProps = {
  editing: boolean
  setEditing: (editing: boolean) => void
  selected: string[]
  setSelected: (selected: string[]) => void
  toggle: (value: string, range: boolean) => void
  selectAll: () => void
  clear: () => void
}

const SelectionListContext =
  React.createContext<SelectionListContextProps | null>(null)

function useSelectionList() {
  const context = React.useContext(SelectionListContext)

  if (!context) {
    throw new Error("useSelectionList must be used within a <SelectionList />")
  }

  return context
}

function itemValues(root: HTMLElement | null) {
  return Array.from(
    root?.querySelectorAll<HTMLElement>("[data-slot=selection-list-item]") ??
      [],
    (item) => item.dataset.value ?? ""
  )
}

function SelectionList({
  editing: editingProp,
  defaultEditing = false,
  onEditingChange,
  value,
  defaultValue = [],
  onValueChange,
  className,
  ...props
}: Omit<React.ComponentProps<"div">, "defaultValue"> & {
  editing?: boolean
  defaultEditing?: boolean
  onEditingChange?: (editing: boolean) => void
  value?: string[]
  defaultValue?: string[]
  onValueChange?: (value: string[]) => void
}) {
  const [uncontrolledEditing, setUncontrolledEditing] =
    React.useState(defaultEditing)
  const [uncontrolledValue, setUncontrolledValue] = React.useState(defaultValue)
  const editing = editingProp ?? uncontrolledEditing
  const selected = value ?? uncontrolledValue
  const rootRef = React.useRef<HTMLDivElement>(null)
  const anchorRef = React.useRef<string | null>(null)

  const setSelected = React.useCallback(
    (next: string[]) => {
      if (value === undefined) setUncontrolledValue(next)
      onValueChange?.(next)
    },
    [value, onValueChange]
  )

  const setEditing = React.useCallback(
    (next: boolean) => {
      if (editingProp === undefined) setUncontrolledEditing(next)
      onEditingChange?.(next)
      if (!next) {
        anchorRef.current = null
        setSelected([])
      }
    },
    [editingProp, onEditingChange, setSelected]
  )

  const toggle = (item: string, range: boolean) => {
    const values = itemValues(rootRef.current)
    const anchor = anchorRef.current
    if (range && anchor !== null && values.includes(anchor)) {
      const from = values.indexOf(anchor)
      const to = values.indexOf(item)
      const span = values.slice(Math.min(from, to), Math.max(from, to) + 1)
      setSelected([...new Set([...selected, ...span])])
    } else {
      setSelected(
        selected.includes(item)
          ? selected.filter((entry) => entry !== item)
          : [...selected, item]
      )
    }
    anchorRef.current = item
  }

  React.useEffect(() => {
    if (!editing) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !event.defaultPrevented) setEditing(false)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [editing, setEditing])

  const selectAll = () => setSelected(itemValues(rootRef.current))
  const clear = () => setSelected([])

  return (
    <SelectionListContext.Provider
      value={{
        editing,
        setEditing,
        selected,
        setSelected,
        toggle,
        selectAll,
        clear,
      }}
    >
      <div
        ref={rootRef}
        data-slot="selection-list"
        data-editing={editing ? "" : undefined}
        className={cn("group/selection-list", className)}
        {...props}
      />
    </SelectionListContext.Provider>
  )
}

function SelectionListTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) {
  const { editing, setEditing } = useSelectionList()

  return (
    <Button
      variant="plain"
      data-slot="selection-list-trigger"
      aria-pressed={editing}
      onClick={() => setEditing(!editing)}
      className={cn("font-semibold aria-pressed:bg-transparent", className)}
      {...props}
    >
      {children ?? (editing ? "Done" : "Select")}
    </Button>
  )
}

function SelectionListItem({
  value,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & { value: string }) {
  const { editing, selected, toggle } = useSelectionList()
  const checked = selected.includes(value)
  const contentRef = React.useRef<HTMLDivElement>(null)
  const [label, setLabel] = React.useState<string>()

  React.useLayoutEffect(() => {
    if (editing)
      setLabel(
        contentRef.current?.innerText.replace(/\s+/g, " ").trim() || undefined
      )
  }, [editing])

  const shared = {
    "data-slot": "selection-list-item",
    "data-value": value,
    "data-checked": checked ? "" : undefined,
    className: cn(
      "flex items-center outline-none transition-colors duration-200 focus-visible:focus-ring focus-visible:[--focus-ring-offset:-2px] data-checked:bg-item-selected",
      editing && "cursor-pointer select-none",
      className
    ),
    children: (
      <>
        <span
          aria-hidden
          className="flex w-0 shrink-0 items-center overflow-hidden opacity-0 transition-[width,opacity] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-editing/selection-list:w-10 group-data-editing/selection-list:opacity-100 motion-reduce:transition-none"
        >
          <span
            data-slot="selection-list-indicator"
            className="ms-4 flex size-5.5 shrink-0 scale-50 items-center justify-center rounded-full border-[1.5px] border-label-tertiary transition-[scale,background-color,border-color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] group-data-editing/selection-list:scale-100 in-data-checked:border-accent in-data-checked:bg-accent motion-reduce:transition-none"
          >
            <CheckIcon
              weight="bold"
              className="size-3.5 scale-0 text-on-accent transition-transform duration-200 in-data-checked:scale-100"
            />
          </span>
        </span>
        <div
          ref={contentRef}
          data-slot="selection-list-item-content"
          inert={editing}
          className="flex min-w-0 flex-1 items-center"
        >
          {children}
        </div>
      </>
    ),
  }

  if (!editing) return <div {...props} {...shared} />

  return (
    <div
      {...props}
      {...shared}
      role="checkbox"
      aria-checked={checked}
      aria-label={props["aria-label"] ?? label}
      tabIndex={0}
      onClick={(event) => {
        props.onClick?.(event)
        toggle(value, event.shiftKey)
      }}
      onKeyDown={(event) => {
        props.onKeyDown?.(event)
        if (event.key === " " || event.key === "Enter") {
          event.preventDefault()
          toggle(value, event.shiftKey)
        }
      }}
    />
  )
}

function SelectionListBar({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { editing } = useSelectionList()

  return (
    <div
      role="toolbar"
      data-slot="selection-list-bar"
      data-closed={editing ? undefined : ""}
      inert={!editing}
      className={cn(
        "fixed inset-x-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 mx-auto flex h-13 max-w-md items-center justify-between gap-2 rounded-full bg-surface-raised/80 px-1.5 text-label shadow-xl ring-1 ring-separator backdrop-blur-3xl backdrop-saturate-180 transition-[translate,opacity,scale,visibility] duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] transition-discrete data-closed:invisible data-closed:opacity-0 data-closed:duration-300 motion-safe:data-closed:translate-y-[calc(100%+1rem)] motion-safe:data-closed:scale-95 dark:bg-surface-secondary/75",
        className
      )}
      {...props}
    />
  )
}

function SelectionListCount({
  className,
  children,
  ...props
}: React.ComponentProps<"span">) {
  const { selected } = useSelectionList()

  return (
    <span
      data-slot="selection-list-count"
      aria-live="polite"
      className={cn(
        "min-w-0 flex-1 truncate text-center text-sm font-medium tabular-nums",
        className
      )}
      {...props}
    >
      {children ??
        (selected.length === 0
          ? "Select items"
          : `${selected.length} selected`)}
    </span>
  )
}

export {
  SelectionList,
  SelectionListBar,
  SelectionListCount,
  SelectionListItem,
  SelectionListTrigger,
  useSelectionList,
}
