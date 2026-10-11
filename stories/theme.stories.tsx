import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Text } from "@/components/ui/text"
import {
  type Theme,
  ThemeProvider,
  type ThemeStorage,
  ThemeToggle,
  useTheme,
} from "@/components/ui/theme"

function Preview() {
  const { theme, resolvedTheme } = useTheme()
  return (
    <View className="w-full gap-6">
      <View className="gap-2">
        <Text variant="h2">Light and dark.</Text>
        <Text className="text-label-secondary">
          Every surface, label and accent follows the theme tokens, so the whole
          app changes at once.
        </Text>
      </View>
      <ThemeToggle />
      <View className="gap-1 rounded-2xl bg-surface-secondary p-4">
        <Text className="text-sm text-label-secondary">Selected</Text>
        <Text className="font-semibold">{theme}</Text>
        <Text className="mt-2 text-sm text-label-secondary">Showing</Text>
        <Text className="font-semibold">{resolvedTheme}</Text>
      </View>
    </View>
  )
}

function Demo({
  defaultTheme,
  storage,
}: {
  defaultTheme: Theme
  storage?: ThemeStorage
}) {
  return (
    <ThemeProvider
      defaultTheme={defaultTheme}
      storage={storage}
      storageKey="theme-story"
    >
      <Preview />
    </ThemeProvider>
  )
}

const meta = {
  title: "Components/Theme",
  component: Demo,
  args: { defaultTheme: "system" },
} satisfies Meta<typeof Demo>

export default meta

type Story = StoryObj<typeof meta>

export const System: Story = {}

export const Light: Story = {
  args: { defaultTheme: "light" },
}

export const Dark: Story = {
  args: { defaultTheme: "dark" },
}

const savedDark = new Map<string, string>([["theme-story", "dark"]])

export const WithStorage: Story = {
  args: {
    defaultTheme: "light",
    storage: {
      getItem: (key) => Promise.resolve(savedDark.get(key) ?? null),
      setItem: (key, value) => {
        savedDark.set(key, value)
      },
    },
  },
}
