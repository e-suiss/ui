import * as React from "react"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
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

export default function ComboboxDisabled() {
  const [value, setValue] = React.useState<string | null>("Astro")
  return (
    <Combobox
      items={frameworks}
      value={value}
      onValueChange={setValue}
      disabled
    >
      <ComboboxInput
        className="w-64"
        placeholder="Select a framework"
        disabled
      />
      <ComboboxContent>
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
