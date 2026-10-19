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
import { Label } from "@/components/ui/label"
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

export default function ComboboxWithLabel() {
  const [value, setValue] = React.useState<string | null>(null)
  return (
    <View className="gap-2">
      <Label nativeID="combobox-framework">Framework</Label>
      <Combobox items={frameworks} value={value} onValueChange={setValue}>
        <ComboboxInput
          className="w-64"
          placeholder="Select a framework"
          accessibilityLabelledBy="combobox-framework"
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
      <Text className="text-sm text-muted-foreground">
        Search and pick the framework you use.
      </Text>
    </View>
  )
}
