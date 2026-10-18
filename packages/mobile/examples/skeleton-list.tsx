import { View } from "react-native"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonList() {
  return (
    <View className="gap-4">
      {["one", "two", "three", "four"].map((key) => (
        <View key={key} className="flex-row items-center gap-3">
          <Skeleton className="size-10 rounded-md" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-3 w-1/3" />
          </View>
        </View>
      ))}
    </View>
  )
}
