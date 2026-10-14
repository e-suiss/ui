import type { Meta, StoryObj } from "@storybook/react-native"
import {
  BellIcon,
  CloudArrowUpIcon,
  WifiSlashIcon,
} from "phosphor-react-native"
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
      <Text role="status" className="text-sm text-label-secondary">
        {log}
      </Text>
    </View>
  )
}

function ShowOnMount({
  options,
}: {
  options: Parameters<ReturnType<typeof useTopBanner>["show"]>[0]
}) {
  const { show } = useTopBanner()
  const shownRef = React.useRef(false)
  const optionsRef = React.useRef(options)

  React.useEffect(() => {
    if (shownRef.current) return
    shownRef.current = true
    show(optionsRef.current)
  }, [show])

  return <Triggers />
}

const meta = {
  title: "Interactions/Top Banner",
  component: TopBannerProvider,
} satisfies Meta<typeof TopBannerProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <TopBannerProvider>
      <Triggers />
    </TopBannerProvider>
  ),
}

export const Showing: Story = {
  render: () => (
    <TopBannerProvider timeout={600000}>
      <ShowOnMount
        options={{
          title: "Message sent",
          description: "Alex will see it the next time they open the app.",
        }}
      />
    </TopBannerProvider>
  ),
}

export const WithIcon: Story = {
  render: () => (
    <TopBannerProvider timeout={600000}>
      <ShowOnMount
        options={{
          icon: BellIcon,
          title: "Reminders are on",
          description: "We will remind you 10 minutes before each event.",
        }}
      />
    </TopBannerProvider>
  ),
}

export const WithAction: Story = {
  render: () => (
    <TopBannerProvider timeout={600000}>
      <ShowOnMount
        options={{
          icon: CloudArrowUpIcon,
          title: "Upload paused",
          description: "3 photos are waiting for Wi-Fi.",
          action: { label: "Resume", onPress: () => {} },
        }}
      />
    </TopBannerProvider>
  ),
}

export const TitleOnly: Story = {
  render: () => (
    <TopBannerProvider timeout={600000}>
      <ShowOnMount options={{ title: "Copied to clipboard" }} />
    </TopBannerProvider>
  ),
}
