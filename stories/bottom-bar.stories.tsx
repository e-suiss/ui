import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

function Page({ children }: { children: React.ReactNode }) {
  return (
    <View className="-m-4 flex-1">
      <View className="flex-1 gap-2 p-4">
        <Text variant="h3">Review order</Text>
        <Text variant="muted">2 items, delivery on Thursday.</Text>
      </View>
      {children}
    </View>
  )
}

const meta = {
  title: "Components/Bottom Bar",
  component: BottomBar,
} satisfies Meta<typeof BottomBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <Page>
      <BottomBar>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Continue</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Page>
  ),
}

export const WithSeparator: Story = {
  render: () => (
    <Page>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Place order</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Page>
  ),
}

export const TwoActions: Story = {
  render: () => (
    <Page>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Place order</Text>
          </Button>
          <Button size="lg" variant="plain" block>
            <Text>Save for later</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Page>
  ),
}

export const SideBySide: Story = {
  render: () => (
    <Page>
      <BottomBar separator>
        <BottomBarContent className="flex-row">
          <Button size="lg" variant="secondary" block className="flex-1">
            <Text>Back</Text>
          </Button>
          <Button size="lg" block className="flex-1">
            <Text>Next</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Page>
  ),
}

export const AboveKeyboard: Story = {
  render: () => (
    <View className="-m-4 flex-1">
      <View className="flex-1 gap-3 p-4">
        <Text variant="h3">Promo code</Text>
        <Input placeholder="Enter code" autoFocus autoCapitalize="characters" />
      </View>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block>
            <Text>Apply</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </View>
  ),
}
