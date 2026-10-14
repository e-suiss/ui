import * as React from "react"
import {
  FlatList,
  type FlatListProps,
  type StyleProp,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

const styles = StyleSheet.create({
  root: { flex: 1 },
  loadMore: { marginTop: 16 },
})

function PagedList<T>({
  items,
  pageSize = 10,
  getKey = (_, index) => index,
  renderItem,
  loadMoreLabel = "Load more",
  style,
  listStyle,
  ...props
}: Omit<
  FlatListProps<T>,
  | "data"
  | "renderItem"
  | "keyExtractor"
  | "onEndReached"
  | "ListFooterComponent"
  | "contentContainerStyle"
> & {
  items: T[]
  pageSize?: number
  getKey?: (item: T, index: number) => React.Key
  renderItem: (item: T, index: number) => React.ReactNode
  loadMoreLabel?: string
  listStyle?: StyleProp<ViewStyle>
}) {
  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const [loaded, setLoaded] = React.useState(1)
  const end = loaded * pageSize
  const hasMore = end < items.length
  const visible = React.useMemo(() => items.slice(0, end), [items, end])

  const loadMore = React.useCallback(() => {
    setLoaded((current) => Math.min(current + 1, pageCount))
  }, [pageCount])

  return (
    <FlatList
      data={visible}
      keyExtractor={(item, index) => String(getKey(item, index))}
      renderItem={({ item, index }) => <View>{renderItem(item, index)}</View>}
      onEndReached={hasMore ? loadMore : undefined}
      onEndReachedThreshold={0.5}
      style={[styles.root, style]}
      contentContainerStyle={listStyle}
      ListFooterComponent={
        hasMore ? (
          <Button
            variant="secondary"
            size="lg"
            block
            style={styles.loadMore}
            onPress={loadMore}
          >
            <Text>{loadMoreLabel}</Text>
          </Button>
        ) : null
      }
      {...props}
    />
  )
}

export { PagedList }
