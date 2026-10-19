import * as React from "react"
import { View } from "react-native"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { Text } from "@/components/ui/text"

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
  "Gatsby",
  "Expo",
]

export default function ComboboxInvalid() {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <View className="gap-2">
      <Combobox items={frameworks} value={value} onValueChange={setValue}>
        <ComboboxInput
          className="w-64"
          placeholder="Select a framework"
          invalid
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
      <Text className="text-sm text-destructive">
        Please select a framework.
      </Text>
    </View>
  )
}
