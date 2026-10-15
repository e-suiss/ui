import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { FlatList, View } from "react-native"
import {
  PullToRefresh,
  PullToRefreshControl,
} from "@/components/interactions/pull-to-refresh"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

function Feed() {
  const [count, setCount] = React.useState(3)
  return (
    <PullToRefresh
      onRefresh={async () => {
        await wait(1200)
        setCount((current) => current + 1)
      }}
      contentContainerClassName="gap-3"
    >
      <Text className="text-sm text-label-secondary">Pull down to refresh</Text>
      <ItemGroup variant="inset">
        {Array.from({ length: count }, (_, index) => count - index).map(
          (update, index) => (
            <React.Fragment key={update}>
              {index > 0 ? <ItemSeparator /> : null}
              <Item>
                <ItemContent>
                  <ItemTitle>Update {update}</ItemTitle>
                  <ItemDescription>Fetched from the server</ItemDescription>
                </ItemContent>
              </Item>
            </React.Fragment>
          )
        )}
      </ItemGroup>
    </PullToRefresh>
  )
}

const meta = {
  title: "Interactions/Pull To Refresh",
  component: PullToRefresh,
} satisfies Meta<typeof PullToRefresh>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { onRefresh: () => undefined },
  render: () => (
    <View className="flex-1">
      <Feed />
    </View>
  ),
}

export const WithFlatList: Story = {
  args: { onRefresh: () => undefined },
  render: () => (
    <FlatList
      data={["Inbox", "Drafts", "Sent", "Archive"]}
      keyExtractor={(item) => item}
      refreshControl={<PullToRefreshControl onRefresh={() => wait(1000)} />}
      renderItem={({ item }) => <Text className="py-3 text-base">{item}</Text>}
    />
  ),
}
