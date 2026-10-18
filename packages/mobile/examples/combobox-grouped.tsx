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

interface Produce {
  value: string
  label: string
}

const produce: { value: string; items: Produce[] }[] = [
  {
    value: "Fruits",
    items: [
      { value: "mango", label: "Mango" },
      { value: "banana", label: "Banana" },
      { value: "blueberry", label: "Blueberry" },
    ],
  },
  {
    value: "Vegetables",
    items: [
      { value: "carrot", label: "Carrot" },
      { value: "broccoli", label: "Broccoli" },
      { value: "spinach", label: "Spinach" },
    ],
  },
]

function GroupedDemo() {
  return (
    <Combobox items={produce} itemToStringLabel={(item: Produce) => item.label}>
      <ComboboxInput className="w-64" placeholder="Select produce" />
      <ComboboxContent>
        <ComboboxEmpty>No produce found.</ComboboxEmpty>
        <ComboboxList>
          {(group: (typeof produce)[number], index: number) => (
            <React.Fragment key={group.value}>
              {index > 0 ? <ComboboxSeparator /> : null}
              <ComboboxGroup items={group.items}>
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: Produce) => (
                    <ComboboxItem key={item.value} value={item}>
                      {item.label}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            </React.Fragment>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ComboboxGrouped() {
  return <GroupedDemo />
}
