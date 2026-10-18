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
    <View className="size-40 items-center justify-center rounded-3xl bg-muted">
      <Icon as={icon} weight="duotone" className="size-20 text-green-500" />
    </View>
  )
}

export default function OnboardingCustomPages() {
  return (
    <View className="-m-4 flex-1">
      <Onboarding
        onDone={() => undefined}
        pages={[
          {
            title: "Find your trail",
            description:
              "Thousands of routes, sorted by distance and difficulty.",
            illustration: <Illustration icon={MapTrifoldIcon} />,
          },
          {
            title: "Record every step",
            description: "Track your hike offline and see your pace as you go.",
            illustration: <Illustration icon={PathIcon} />,
          },
          {
            title: "Share with friends",
            description:
              "Send a route in one tap and plan the next trip together.",
            illustration: <Illustration icon={ShareNetworkIcon} />,
          },
        ]}
      />
    </View>
  )
}
