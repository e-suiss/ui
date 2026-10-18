import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

export default function SpinnerInButton() {
  return (
    <View className="items-start gap-3">
      <Button disabled>
        <Spinner colorClassName="accent-primary-foreground" />
        <Text>Saving</Text>
      </Button>
      <Button variant="secondary" disabled>
        <Spinner />
        <Text>Loading</Text>
      </Button>
    </View>
  )
}
