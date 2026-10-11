import type { Meta, StoryObj } from "@storybook/react-native"
import {
  CameraIcon,
  MapPinIcon,
  NavigationArrowIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  StorefrontIcon,
  UserFocusIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { PermissionPrimer } from "@/components/blocks/permission-primer"

const meta = {
  title: "Blocks/Permission Primer",
  component: PermissionPrimer,
  args: {
    onAllow: () => {},
    onDismiss: () => {},
  },
  decorators: [
    (Story) => (
      <View className="-m-4 flex-1">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof PermissionPrimer>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Camera: Story = {
  args: {
    icon: CameraIcon,
    title: "Scan and snap",
    description:
      "Allow camera access to scan codes and add photos to your messages.",
    benefits: [
      {
        icon: QrCodeIcon,
        title: "Scan codes",
        description: "Pay, sign in and join networks with a QR code.",
      },
      {
        icon: UserFocusIcon,
        title: "Profile photo",
        description: "Take a new picture without leaving the app.",
      },
      {
        icon: ShieldCheckIcon,
        title: "Only when you ask",
        description: "The camera is used only while this screen is open.",
      },
    ],
    allowLabel: "Allow Camera",
  },
}

export const Location: Story = {
  args: {
    icon: MapPinIcon,
    title: "Find stores near you",
    description: "Share your location to see pickup times and directions.",
    benefits: [
      {
        icon: StorefrontIcon,
        title: "Nearby stores",
        description: "See which store has your item in stock today.",
      },
      {
        icon: NavigationArrowIcon,
        title: "Directions",
        description: "Get walking and driving routes in one tap.",
      },
    ],
    allowLabel: "Share Location",
    dismissLabel: "Maybe later",
  },
}
