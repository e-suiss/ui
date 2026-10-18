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

function ComboboxDemo({
  defaultValue = null,
  defaultOpen,
  disabled,
  showClear,
  labelledBy,
  invalid,
}: {
  defaultValue?: string | null
  defaultOpen?: boolean
  disabled?: boolean
  showClear?: boolean
  labelledBy?: string
  invalid?: boolean
}) {
  const [value, setValue] = React.useState<string | null>(defaultValue)
  return (
    <Combobox
      items={frameworks}
      value={value}
      onValueChange={setValue}
      defaultOpen={defaultOpen}
      disabled={disabled}
    >
      <ComboboxInput
        className="w-64"
        placeholder="Select a framework"
        showClear={showClear}
        disabled={disabled}
        invalid={invalid}
        accessibilityLabelledBy={labelledBy}
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

export default function ComboboxDisabled() {
  return <ComboboxDemo defaultValue="Astro" disabled />
}
