import { View } from "react-native"
import { Progress } from "@/components/ui/progress"

export default function ProgressValues() {
  return (
    <View className="w-full gap-4">
      <Progress value={0} />
      <Progress value={25} />
      <Progress value={50} />
      <Progress value={75} />
      <Progress value={100} indicatorClassName="bg-green-500" />
    </View>
  )
}
