import { View } from "react-native"
import { Spinner } from "@/components/ui/spinner"

export default function SpinnerColors() {
  return (
    <View className="flex-row items-center gap-6">
      <Spinner size={24} colorClassName="accent-foreground" />
      <Spinner size={24} colorClassName="accent-primary" />
      <Spinner size={24} colorClassName="accent-destructive" />
    </View>
  )
}
