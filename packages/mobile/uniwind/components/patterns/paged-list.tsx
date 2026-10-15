import { cn } from "cn"
import * as React from "react"
import { FlatList, type FlatListProps, View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function PagedList<T>({
  items,
  pageSize = 10,
  getKey = (_, index) => index,
  renderItem,
  loadMoreLabel = "Load more",
  className,
  listClassName,
  ...props
}: Omit<
  FlatListProps<T>,
  | "data"
  | "renderItem"
  | "keyExtractor"
  | "onEndReached"
  | "ListFooterComponent"
  | "contentContainerClassName"
> & {
  items: T[]
  pageSize?: number
  getKey?: (item: T, index: number) => React.Key
  renderItem: (item: T, index: number) => React.ReactNode
  loadMoreLabel?: string
  className?: string
  listClassName?: string
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
      className={cn("flex-1", className)}
      contentContainerClassName={listClassName}
      ListFooterComponent={
        hasMore ? (
          <Button
            variant="secondary"
            size="lg"
            block
            className="mt-4"
            onPress={loadMore}
          >
            <Text>{loadMoreLabel}</Text>
          </Button>
        ) : undefined
      }
      {...props}
    />
  )
}

export { PagedList }
