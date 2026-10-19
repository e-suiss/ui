import { WifiSlashIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import {
  TopBannerProvider,
  useTopBanner,
} from "@/components/interactions/top-banner"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function Triggers() {
  const { show, dismiss } = useTopBanner()
  const [log, setLog] = React.useState("")
  const shownRef = React.useRef(false)

  React.useEffect(() => {
    if (shownRef.current) return
    shownRef.current = true
    show({ title: "Copied to clipboard" })
  }, [show])

  return (
    <View className="w-full gap-3">
      <Button
        variant="outline"
        onPress={() =>
          show({
            title: "Message sent",
            description: "Alex will see it the next time they open the app.",
          })
        }
      >
        <Text>Show banner</Text>
      </Button>
      <Button
        variant="outline"
        onPress={() =>
          show({
            icon: WifiSlashIcon,
            title: "You are offline",
            description: "Changes will sync when you reconnect.",
            action: { label: "Retry", onPress: () => setLog("Retry pressed") },
          })
        }
      >
        <Text>Show with icon and action</Text>
      </Button>
      <Button
        variant="outline"
        onPress={() => {
          show({ title: "First of three" })
          show({ title: "Second of three" })
          show({ title: "Third of three" })
        }}
      >
        <Text>Queue three</Text>
      </Button>
      <Button variant="ghost" onPress={() => dismiss()}>
        <Text>Dismiss current</Text>
      </Button>
      <Text role="status" className="text-sm text-muted-foreground">
        {log}
      </Text>
    </View>
  )
}

export default function TopBannerTitleOnly() {
  return (
    <TopBannerProvider timeout={600000}>
      <Triggers />
    </TopBannerProvider>
  )
}
