import type { Meta, StoryObj } from "@storybook/react-native"
import { View } from "react-native"
import { Skeleton } from "@/components/ui/skeleton"

const meta = {
  title: "Components/Skeleton",
  component: Skeleton,
} satisfies Meta<typeof Skeleton>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <Skeleton className="h-4 w-48" />,
}

export const Profile: Story = {
  render: () => (
    <View className="flex-row items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <View className="gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
      </View>
    </View>
  ),
}

export const Card: Story = {
  render: () => (
    <View className="gap-3">
      <Skeleton className="h-32 w-full rounded-xl" />
      <View className="gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </View>
    </View>
  ),
}

export const List: Story = {
  render: () => (
    <View className="gap-4">
      {["one", "two", "three", "four"].map((key) => (
        <View key={key} className="flex-row items-center gap-3">
          <Skeleton className="size-10 rounded-md" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </View>
        </View>
      ))}
    </View>
  ),
}
