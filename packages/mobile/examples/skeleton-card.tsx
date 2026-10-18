import { View } from "react-native"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonCard() {
  return (
    <View className="gap-3">
      <Skeleton className="h-32 w-full rounded-xl" />
      <View className="gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </View>
    </View>
  )
}
