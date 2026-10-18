import { View } from "react-native"
import { Onboarding } from "@/components/blocks/onboarding"

export default function OnboardingTextOnly() {
  return (
    <View className="-m-4 flex-1">
      <Onboarding
        onDone={() => undefined}
        pages={[
          {
            title: "Welcome",
            description: "A short tour of what's new in this version.",
          },
          {
            title: "Widgets",
            description: "Add your favorite lists to the Home Screen.",
          },
          {
            title: "Shortcuts",
            description: "Long press the app icon to jump straight to search.",
          },
        ]}
      />
    </View>
  )
}
