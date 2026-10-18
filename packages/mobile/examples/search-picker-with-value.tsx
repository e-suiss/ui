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

export default function SearchPickerWithValue() {
  return (
    <SearchPicker
      items={frameworks}
      placeholder="Select a framework"
      searchPlaceholder="Search frameworks..."
      emptyText="No framework found."
      accessibilityLabel="Framework"
      className="w-56"
      defaultValue="astro"
    />
  )
}
