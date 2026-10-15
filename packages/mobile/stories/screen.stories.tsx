import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Screen, ScreenContent } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

function Rows({ count = 4 }: { count?: number }) {
  return (
    <View className="overflow-hidden rounded-2xl bg-muted">
      {Array.from({ length: count }, (_, index) => `Row ${index + 1}`).map(
        (label, index) => (
          <View
            key={label}
            className={
              index > 0 ? "border-t border-border px-4 py-3" : "px-4 py-3"
            }
          >
            <Text>{label}</Text>
          </View>
        )
      )}
    </View>
  )
}

const meta = {
  title: "Components/Screen",
  component: Screen,
} satisfies Meta<typeof Screen>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Screen className="-m-4">
      <ScreenContent>
        <Text variant="h2">Account</Text>
        <Text variant="muted">
          The screen pads every safe-area edge and sets the status bar style
          from the color scheme.
        </Text>
        <Rows />
      </ScreenContent>
    </Screen>
  ),
}

export const Secondary: Story = {
  render: () => (
    <Screen variant="secondary" className="-m-4">
      <ScreenContent>
        <Text variant="h2">Settings</Text>
        <View className="overflow-hidden rounded-2xl bg-background">
          {["General", "Privacy", "Notifications"].map((label, index) => (
            <View
              key={label}
              className={
                index > 0 ? "border-t border-border px-4 py-3" : "px-4 py-3"
              }
            >
              <Text>{label}</Text>
            </View>
          ))}
        </View>
      </ScreenContent>
    </Screen>
  ),
}

export const Scrollable: Story = {
  render: () => (
    <Screen className="-m-4">
      <ScreenContent scrollable>
        <Text variant="h2">Long content</Text>
        <Rows count={24} />
      </ScreenContent>
    </Screen>
  ),
}

export const TopEdgeOnly: Story = {
  render: () => (
    <Screen edges={["top"]} className="-m-4">
      <ScreenContent className="bg-muted">
        <Text variant="h3">Top edge only</Text>
        <Text variant="muted">
          The bottom, left and right edges are not padded.
        </Text>
      </ScreenContent>
    </Screen>
  ),
}

export const WithBottomBar: Story = {
  render: () => (
    <Screen className="-m-4">
      <ScreenContent scrollable>
        <Text variant="h2">Your email</Text>
        <Text variant="muted">We will send a code to this address.</Text>
        <Input placeholder="name@example.com" keyboardType="email-address" />
      </ScreenContent>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Continue</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  ),
}
