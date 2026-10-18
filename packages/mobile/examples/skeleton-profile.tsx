import { View } from "react-native"
import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonProfile() {
  return (
    <View className="flex-row items-center gap-4">
      <Skeleton className="size-12 rounded-full" />
      <View className="gap-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
      </View>
    </View>
  )
}
