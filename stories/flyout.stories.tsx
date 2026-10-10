import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  Flyout,
  FlyoutBody,
  FlyoutClose,
  FlyoutContent,
  FlyoutDescription,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutTrigger,
} from "@/components/patterns/flyout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Text } from "@/components/ui/text"

function FlyoutDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <View className="items-start">
      <Flyout defaultOpen={defaultOpen}>
        <FlyoutTrigger render={<Button variant="outline" />}>
          <Text>Dimensions</Text>
        </FlyoutTrigger>
        <FlyoutContent>
          <FlyoutHeader>
            <FlyoutTitle>Dimensions</FlyoutTitle>
            <FlyoutDescription>
              Set the dimensions for the layer.
            </FlyoutDescription>
          </FlyoutHeader>
          <FlyoutBody className="gap-3">
            <Input defaultValue="100%" accessibilityLabel="Width" />
            <Input defaultValue="25px" accessibilityLabel="Height" />
            <FlyoutClose render={<Button variant="secondary" />}>
              <Text>Done</Text>
            </FlyoutClose>
          </FlyoutBody>
        </FlyoutContent>
      </Flyout>
    </View>
  )
}

const meta = {
  title: "Patterns/Flyout",
  component: Flyout,
} satisfies Meta<typeof Flyout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <FlyoutDemo />,
}

export const OpenByDefault: Story = {
  render: () => <FlyoutDemo defaultOpen />,
}
