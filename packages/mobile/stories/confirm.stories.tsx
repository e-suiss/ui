import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  Confirm,
  ConfirmAction,
  ConfirmCancel,
  ConfirmContent,
  ConfirmDescription,
  ConfirmFooter,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmTrigger,
} from "@/components/patterns/confirm"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function ConfirmDemo({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <View className="items-start">
      <Confirm defaultOpen={defaultOpen}>
        <ConfirmTrigger render={<Button variant="destructive" />}>
          <Text>Delete account</Text>
        </ConfirmTrigger>
        <ConfirmContent>
          <ConfirmHeader>
            <ConfirmTitle>Delete your account?</ConfirmTitle>
            <ConfirmDescription>
              This permanently deletes your account and all of its data.
            </ConfirmDescription>
          </ConfirmHeader>
          <ConfirmFooter>
            <ConfirmCancel>Cancel</ConfirmCancel>
            <ConfirmAction variant="destructive">Delete Account</ConfirmAction>
          </ConfirmFooter>
        </ConfirmContent>
      </Confirm>
    </View>
  )
}

const meta = {
  title: "Patterns/Confirm",
  component: Confirm,
} satisfies Meta<typeof Confirm>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ConfirmDemo />,
}

export const OpenByDefault: Story = {
  render: () => <ConfirmDemo defaultOpen />,
}
