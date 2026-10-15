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

const timezones = [
  {
    value: "Americas",
    items: ["New York", "Chicago", "Los Angeles", "São Paulo"],
  },
  {
    value: "Europe",
    items: ["London", "Berlin", "Istanbul", "Madrid"],
  },
  {
    value: "Asia",
    items: ["Tokyo", "Singapore", "Dubai"],
  },
]

export default function ComboboxGrouped() {
  return (
    <div className="w-72">
      <Combobox items={timezones}>
        <ComboboxInput placeholder="Select a city" />
        <ComboboxContent>
          <ComboboxEmpty>No city found.</ComboboxEmpty>
          <ComboboxList>
            {(group: (typeof timezones)[number], index: number) => (
              <ComboboxGroup key={group.value} items={group.items}>
                {index > 0 && <ComboboxSeparator />}
                <ComboboxLabel>{group.value}</ComboboxLabel>
                <ComboboxCollection>
                  {(item: string) => (
                    <ComboboxItem key={item} value={item}>
                      {item}
                    </ComboboxItem>
                  )}
                </ComboboxCollection>
              </ComboboxGroup>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  )
}
