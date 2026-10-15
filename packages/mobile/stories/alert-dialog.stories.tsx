import type { Meta, StoryObj } from "@storybook/react-native"
import { TrashIcon } from "phosphor-react-native"
import { View } from "react-native"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
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

export const Small: Story = {
  render: () => (
    <View className="items-start">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="outline" />}>
          <Text>Discard draft</Text>
        </AlertDialogTrigger>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Discard draft?</AlertDialogTitle>
            <AlertDialogDescription>
              Your unsaved message will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Keep</Text>
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              <Text>Discard</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  ),
}

export const WithMedia: Story = {
  render: () => (
    <View className="items-start">
      <AlertDialog>
        <AlertDialogTrigger render={<Button variant="destructive" />}>
          <Text>Delete project</Text>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10">
              <Icon as={TrashIcon} className="text-destructive" />
            </AlertDialogMedia>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently removes the project and all of its files. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              <Text>Cancel</Text>
            </AlertDialogCancel>
            <AlertDialogAction variant="destructive">
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
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
            <AlertDialogAction variant="destructive">
              <Text>Delete</Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </View>
  ),
}
