import * as React from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
  "Gatsby",
  "Expo",
]

function MultipleDemo() {
  const anchor = useComboboxAnchor()
  const [value, setValue] = React.useState<string[]>(["Expo", "Astro"])
  return (
    <Combobox
      multiple
      items={frameworks}
      value={value}
      onValueChange={setValue}
    >
      <ComboboxChips ref={anchor} className="w-72">
        {value.map((item) => (
          <ComboboxChip key={item} value={item}>
            {item}
          </ComboboxChip>
        ))}
        <ComboboxChipsInput placeholder="Add framework" />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No framework found.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function ComboboxMultiple() {
  return <MultipleDemo />
}
