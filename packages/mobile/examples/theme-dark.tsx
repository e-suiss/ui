import { View } from "react-native"
import { Text } from "@/components/ui/text"
import { ThemeProvider, ThemeToggle, useTheme } from "@/components/ui/theme"

function ThemeStatus() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <View className="w-full gap-6">
      <View className="gap-2">
        <Text variant="h2">Light and dark.</Text>
        <Text className="text-muted-foreground">
          Every surface, label and accent follows the theme tokens, so the whole
          app changes at once.
        </Text>
      </View>
      <ThemeToggle />
      <View className="gap-1 rounded-2xl bg-muted p-4">
        <Text className="text-sm text-muted-foreground">Selected</Text>
        <Text className="font-semibold">{theme}</Text>
        <Text className="mt-2 text-sm text-muted-foreground">Showing</Text>
        <Text className="font-semibold">{resolvedTheme}</Text>
      </View>
    </View>
  )
}

export default function ThemeDark() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="theme-story">
      <ThemeStatus />
    </ThemeProvider>
  )
}
