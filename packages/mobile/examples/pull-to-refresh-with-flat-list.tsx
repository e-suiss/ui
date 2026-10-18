import { FlatList } from "react-native"
import { PullToRefreshControl } from "@/components/interactions/pull-to-refresh"
import { Text } from "@/components/ui/text"

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

export default function PullToRefreshWithFlatList() {
  return (
    <FlatList
      data={["Inbox", "Drafts", "Sent", "Archive"]}
      keyExtractor={(item) => item}
      refreshControl={<PullToRefreshControl onRefresh={() => wait(1000)} />}
      renderItem={({ item }) => <Text className="py-3 text-base">{item}</Text>}
    />
  )
}
