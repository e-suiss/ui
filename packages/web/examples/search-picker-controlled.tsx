import * as React from "react"
import {
  SearchPicker,
  type SearchPickerItem,
} from "@/components/patterns/search-picker"

const frameworks: SearchPickerItem[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "gatsby", label: "Gatsby", disabled: true },
]

function ControlledExample(props: React.ComponentProps<typeof SearchPicker>) {
  const [value, setValue] = React.useState<string | null>("next")

  return (
    <div className="flex flex-col items-start gap-2">
      <SearchPicker {...props} value={value} onValueChange={setValue} />
      <p className="text-sm text-label-secondary">
        Selected: {value ?? "none"}
      </p>
    </div>
  )
}

export default function SearchPickerControlled() {
  return (
    <ControlledExample
      items={frameworks}
      placeholder="Select a framework"
      searchPlaceholder="Search frameworks..."
      emptyText="No framework found."
      aria-label="Framework"
      className="w-56"
    />
  )
}
