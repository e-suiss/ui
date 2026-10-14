import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Text } from "@/components/ui/text"

const fields = [
  "First name",
  "Last name",
  "Email",
  "Phone",
  "Street",
  "City",
  "Postal code",
  "Country",
  "Company",
  "Notes",
]

function Fields() {
  return fields.map((label) => (
    <View key={label} className="gap-1.5">
      <Text variant="small">{label}</Text>
      <Input placeholder={label} />
    </View>
  ))
}

const meta = {
  title: "Components/Keyboard Scroll View",
  component: KeyboardScrollView,
} satisfies Meta<typeof KeyboardScrollView>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <KeyboardScrollView className="-m-4" contentContainerClassName="gap-4 p-4">
      <Text variant="h3">Shipping address</Text>
      <Fields />
    </KeyboardScrollView>
  ),
}

export const LargerBottomOffset: Story = {
  render: () => (
    <KeyboardScrollView
      bottomOffset={64}
      className="-m-4"
      contentContainerClassName="gap-4 p-4"
    >
      <Text variant="h3">64 pt above the keyboard</Text>
      <Fields />
    </KeyboardScrollView>
  ),
}

export const Focused: Story = {
  render: () => (
    <KeyboardScrollView className="-m-4" contentContainerClassName="gap-4 p-4">
      <Text variant="h3">Last field focused</Text>
      {fields.slice(0, -1).map((label) => (
        <View key={label} className="gap-1.5">
          <Text variant="small">{label}</Text>
          <Input placeholder={label} />
        </View>
      ))}
      <View className="gap-1.5">
        <Text variant="small">Notes</Text>
        <Input placeholder="Notes" autoFocus />
      </View>
    </KeyboardScrollView>
  ),
}

export const WithBottomBar: Story = {
  render: () => (
    <View className="-m-4 flex-1">
      <KeyboardScrollView contentContainerClassName="gap-4 p-4">
        <Text variant="h3">Shipping address</Text>
        <Fields />
      </KeyboardScrollView>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Save address</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </View>
  ),
}
