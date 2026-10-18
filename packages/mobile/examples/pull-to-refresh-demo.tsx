import * as React from "react"
import { View } from "react-native"
import { PullToRefresh } from "@/components/interactions/pull-to-refresh"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Text } from "@/components/ui/text"

const wait = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms))

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
      <Text className="text-sm text-muted-foreground">
        Pull down to refresh
      </Text>
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

export default function PullToRefreshDemo() {
  return (
    <View className="flex-1">
      <Feed />
    </View>
  )
}
