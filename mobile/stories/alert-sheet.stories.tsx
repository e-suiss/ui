import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function SheetBody() {
  return (
    <AlertSheetContent>
      <AlertSheetGroup>
        <AlertSheetHeader>
          <AlertSheetTitle>Delete this photo?</AlertSheetTitle>
          <AlertSheetDescription>
            This photo will be deleted from all of your devices.
          </AlertSheetDescription>
        </AlertSheetHeader>
        <AlertSheetAction>Save to Files</AlertSheetAction>
        <AlertSheetAction variant="destructive">Delete Photo</AlertSheetAction>
      </AlertSheetGroup>
      <AlertSheetCancel>Cancel</AlertSheetCancel>
    </AlertSheetContent>
  )
}

const meta = {
  title: "Components/Alert Sheet",
  component: AlertSheet,
} satisfies Meta<typeof AlertSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-start">
      <AlertSheet>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          <Text>Show sheet</Text>
        </AlertSheetTrigger>
        <SheetBody />
      </AlertSheet>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <View className="items-start">
      <AlertSheet defaultOpen>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          <Text>Show sheet</Text>
        </AlertSheetTrigger>
        <SheetBody />
      </AlertSheet>
    </View>
  ),
}

export const NotDismissible: Story = {
  render: () => (
    <View className="items-start">
      <AlertSheet dismissible={false}>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          <Text>Sign out</Text>
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle>Sign out of all devices?</AlertSheetTitle>
            </AlertSheetHeader>
            <AlertSheetAction variant="destructive">Sign Out</AlertSheetAction>
            <AlertSheetAction disabled>Keep Signed In Here</AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </View>
  ),
}
