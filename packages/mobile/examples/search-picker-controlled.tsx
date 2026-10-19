import * as React from "react"
import { View } from "react-native"
import {
  SearchPicker,
  type SearchPickerItem,
} from "@/components/patterns/search-picker"
import { Text } from "@/components/ui/text"

const frameworks: SearchPickerItem[] = [
  { value: "next", label: "Next.js" },
  { value: "remix", label: "Remix" },
  { value: "astro", label: "Astro" },
  { value: "sveltekit", label: "SvelteKit" },
  { value: "nuxt", label: "Nuxt" },
  { value: "gatsby", label: "Gatsby", disabled: true },
]

export default function SearchPickerControlled() {
  const [value, setValue] = React.useState<string | null>("next")

  return (
    <View className="items-start gap-2">
      <SearchPicker
        items={frameworks}
        placeholder="Select a framework"
        searchPlaceholder="Search frameworks..."
        emptyText="No framework found."
        accessibilityLabel="Framework"
        className="w-56"
        value={value}
        onValueChange={setValue}
      />
      <Text className="text-sm text-muted-foreground">
        Selected: {value ?? "none"}
      </Text>
    </View>
  )
}
