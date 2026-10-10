import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  args: {
    placeholder: "Type your message here.",
  },
} satisfies Meta<typeof Textarea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithValue: Story = {
  args: {
    defaultValue:
      "The quick brown fox jumps over the lazy dog. This text spans a few lines to show how the textarea handles longer content.",
  },
}

export const WithLabel: Story = {
  render: () => (
    <View className="gap-2">
      <Label nativeID="textarea-message">Your message</Label>
      <Textarea
        accessibilityLabelledBy="textarea-message"
        placeholder="Type your message here."
      />
      <Text variant="muted">Your message will be copied to the team.</Text>
    </View>
  ),
}

export const Disabled: Story = {
  args: {
    editable: false,
    placeholder: "Disabled",
  },
}

export const Invalid: Story = {
  render: () => (
    <View className="gap-2">
      <Textarea className="border-destructive" defaultValue="Too short" />
      <Text className="text-destructive text-sm">
        Message must be at least 20 characters.
      </Text>
    </View>
  ),
}
