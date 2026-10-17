import type { Meta, StoryObj } from "@storybook/react-native"
import { ScrollView, View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

const meta = {
  title: "AI/Suggestion",
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

const suggestions = [
  "Why does the build fail?",
  "Add dark mode",
  "Write tests for the cart",
  "Explain this error",
]

export const Default: Story = {
  render: () => (
    <View className="w-full gap-3">
      <Text className="text-muted-foreground">Try asking</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        {suggestions.map((suggestion) => (
          <Button key={suggestion} variant="outline" size="sm">
            {suggestion}
          </Button>
        ))}
      </ScrollView>
    </View>
  ),
}
