import {
  BellIcon,
  ChatCircleIcon,
  ClockIcon,
  PackageIcon,
  type Icon as PhosphorIcon,
} from "phosphor-react-native"
import { ScrollView, View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

type PermissionPrimerBenefit = {
  icon: PhosphorIcon
  title: string
  description: string
}

const DEFAULT_BENEFITS: PermissionPrimerBenefit[] = [
  {
    icon: PackageIcon,
    title: "Order updates",
    description: "Know when your order ships and when it arrives.",
  },
  {
    icon: ChatCircleIcon,
    title: "Replies from support",
    description: "Get answers without keeping the app open.",
  },
  {
    icon: ClockIcon,
    title: "Only what matters",
    description: "No ads. Change what you get anytime in Settings.",
  },
]

function PermissionPrimer({
  icon = BellIcon,
  title = "Stay in the loop",
  description = "Turn on notifications so we can tell you when something needs your attention.",
  benefits = DEFAULT_BENEFITS,
  allowLabel = "Allow",
  dismissLabel = "Not now",
  onAllow,
  onDismiss,
}: {
  icon?: PhosphorIcon
  title?: string
  description?: string
  benefits?: PermissionPrimerBenefit[]
  allowLabel?: string
  dismissLabel?: string
  onAllow?: () => void
  onDismiss?: () => void
}) {
  return (
    <Screen>
      <ScrollView contentContainerClassName="grow justify-center gap-8 px-6 py-10">
        <View className="items-center gap-3">
          <View className="mb-3 size-20 items-center justify-center rounded-3xl bg-primary">
            <Icon
              as={icon}
              weight="fill"
              className="size-10 text-primary-foreground"
            />
          </View>
          <Text role="heading" className="text-center text-3xl font-bold">
            {title}
          </Text>
          <Text className="text-center text-lg text-muted-foreground">
            {description}
          </Text>
        </View>
        <View role="list" className="gap-5">
          {benefits.map((benefit) => (
            <View
              key={benefit.title}
              role="listitem"
              className="flex-row items-start gap-4"
            >
              <View className="size-10 items-center justify-center rounded-xl bg-primary-10 dark:bg-primary-20">
                <Icon
                  as={benefit.icon}
                  className="size-[1.375rem] text-primary"
                />
              </View>
              <View className="flex-1 gap-0.5">
                <Text className="text-base font-semibold">{benefit.title}</Text>
                <Text className="text-sm text-muted-foreground">
                  {benefit.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomBar>
        <BottomBarContent>
          <Button size="lg" block onPress={onAllow}>
            <Text>{allowLabel}</Text>
          </Button>
          <Button size="lg" variant="plain" block onPress={onDismiss}>
            <Text>{dismissLabel}</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export type { PermissionPrimerBenefit }
export { PermissionPrimer }
