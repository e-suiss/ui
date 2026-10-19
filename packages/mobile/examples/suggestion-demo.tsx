import { ScrollView, View } from "react-native"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function SuggestionDemo() {
  return (
    <View className="w-full gap-3">
      <Text className="text-muted-foreground">Try asking</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
      >
        <Button variant="outline" size="sm">
          Why does the build fail?
        </Button>
        <Button variant="outline" size="sm">
          Add dark mode
        </Button>
        <Button variant="outline" size="sm">
          Write tests for the cart
        </Button>
        <Button variant="outline" size="sm">
          Explain this error
        </Button>
      </ScrollView>
    </View>
  )
}
