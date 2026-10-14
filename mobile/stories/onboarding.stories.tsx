import type { Meta, StoryObj } from "@storybook/react-native"
import {
  MapTrifoldIcon,
  PathIcon,
  ShareNetworkIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Onboarding } from "@/components/blocks/onboarding"
import { Icon } from "@/components/ui/icon"

function Illustration({ icon }: { icon: typeof PathIcon }) {
  return (
    <View className="size-40 items-center justify-center rounded-3xl bg-surface-secondary">
      <Icon as={icon} weight="duotone" className="size-20 text-green" />
    </View>
  )
}

const meta = {
  title: "Blocks/Onboarding",
  component: Onboarding,
  args: {
    onDone: () => {},
  },
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Onboarding>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomPages: Story = {
  args: {
    pages: [
      {
        title: "Find your trail",
        description: "Thousands of routes, sorted by distance and difficulty.",
        illustration: <Illustration icon={MapTrifoldIcon} />,
      },
      {
        title: "Record every step",
        description: "Track your hike offline and see your pace as you go.",
        illustration: <Illustration icon={PathIcon} />,
      },
      {
        title: "Share with friends",
        description: "Send a route in one tap and plan the next trip together.",
        illustration: <Illustration icon={ShareNetworkIcon} />,
      },
    ],
  },
}

export const TextOnly: Story = {
  args: {
    pages: [
      {
        title: "Welcome",
        description: "A short tour of what's new in this version.",
      },
      {
        title: "Widgets",
        description: "Add your favorite lists to the Home Screen.",
      },
      {
        title: "Shortcuts",
        description: "Long press the app icon to jump straight to search.",
      },
    ],
  },
}
