import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function AlertDialogBody() {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete your
          account and remove your data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>
          <Text>Cancel</Text>
        </AlertDialogCancel>
        <AlertDialogAction>
          <Text>Continue</Text>
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}

const meta = {
  title: "Components/Alert Dialog",
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-start">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          <Text>Show dialog</Text>
        </AlertDialogTrigger>
        <AlertDialogBody />
      </AlertDialog>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <View className="items-start">
      <AlertDialog defaultOpen>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          <Text>Show dialog</Text>
        </AlertDialogTrigger>
        <AlertDialogBody />
      </AlertDialog>
    </View>
  ),
}

export const Destructive: Story = {
  render: () => (
    <View className="items-start">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          <Text>Delete project</Text>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete project?</AlertDialogTitle>
            <AlertDialogDescription>
              All deployments and settings for this project will be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction className="bg-destructive">
              <Text className="text-white">Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  ),
}
