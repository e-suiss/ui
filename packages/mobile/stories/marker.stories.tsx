import type { Meta, StoryObj } from "@storybook/react-native"
import { CalendarBlankIcon, InfoIcon } from "phosphor-react-native"
import { View } from "react-native"
import { Icon } from "@/components/ui/icon"
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker"

const meta = {
  title: "Components/Marker",
  component: Marker,
} satisfies Meta<typeof Marker>

export default meta

type Story = StoryObj<typeof meta>

export const Variants: Story = {
  render: () => (
    <View className="gap-8">
      <Marker>
        <MarkerIcon>
          <Icon as={InfoIcon} />
        </MarkerIcon>
        <MarkerContent>Messages are end-to-end encrypted.</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>Today</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <Icon as={CalendarBlankIcon} />
        </MarkerIcon>
        <MarkerContent>Upcoming</MarkerContent>
      </Marker>
    </View>
  ),
}
