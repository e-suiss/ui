import {
  MapTrifoldIcon,
  PathIcon,
  ShareNetworkIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Onboarding } from "@/components/blocks/onboarding"
import { Icon } from "@/components/ui/icon"

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
            illustration: (
              <View className="size-40 items-center justify-center rounded-3xl bg-muted">
                <Icon
                  as={MapTrifoldIcon}
                  weight="duotone"
                  className="size-20 text-green-500"
                />
              </View>
            ),
          },
          {
            title: "Record every step",
            description: "Track your hike offline and see your pace as you go.",
            illustration: (
              <View className="size-40 items-center justify-center rounded-3xl bg-muted">
                <Icon
                  as={PathIcon}
                  weight="duotone"
                  className="size-20 text-green-500"
                />
              </View>
            ),
          },
          {
            title: "Share with friends",
            description:
              "Send a route in one tap and plan the next trip together.",
            illustration: (
              <View className="size-40 items-center justify-center rounded-3xl bg-muted">
                <Icon
                  as={ShareNetworkIcon}
                  weight="duotone"
                  className="size-20 text-green-500"
                />
              </View>
            ),
          },
        ]}
      />
    </View>
  )
}
