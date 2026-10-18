import { View } from "react-native"
import { Onboarding } from "@/components/blocks/onboarding"

export default function OnboardingDemo() {
  return (
    <View className="-m-4 flex-1">
      <Onboarding onDone={() => undefined} />
    </View>
  )
}
