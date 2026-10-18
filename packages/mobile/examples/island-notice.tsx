import { BellIcon, ChatCircleIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  Island,
  IslandProvider,
  useIsland,
} from "@/components/interactions/island"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function NotifyButtons({ children }: { children?: React.ReactNode }) {
  const { notify } = useIsland()

  return (
    <View className="flex-row flex-wrap justify-center gap-3">
      {children}
      <Button
        variant="secondary"
        onPress={() =>
          notify({
            icon: (
              <Icon
                as={ChatCircleIcon}
                weight="fill"
                className="text-green-500"
              />
            ),
            title: "Jordan Lee",
            description: "Are we still on for Saturday?",
          })
        }
      >
        <Text>New message</Text>
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          notify({
            icon: (
              <Icon as={BellIcon} weight="fill" className="text-orange-500" />
            ),
            title: "Design review",
            description: "Starts in 10 minutes",
          })
        }
      >
        <Text>Reminder</Text>
      </Button>
    </View>
  )
}

function NoticeOnMount() {
  const { notify } = useIsland()
  const shownRef = React.useRef(false)

  React.useEffect(() => {
    if (shownRef.current) return
    shownRef.current = true
    notify({
      icon: (
        <Icon as={ChatCircleIcon} weight="fill" className="text-green-500" />
      ),
      title: "Jordan Lee",
      description: "Are we still on for Saturday?",
      duration: 600000,
    })
  }, [notify])

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Island />
      <Text className="max-w-xs text-center text-sm text-muted-foreground">
        The pill grows to show the notification and shrinks back on its own.
      </Text>
      <NotifyButtons />
    </View>
  )
}

export default function IslandNotice() {
  return (
    <IslandProvider>
      <NoticeOnMount />
    </IslandProvider>
  )
}
