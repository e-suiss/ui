import { View } from "react-native"
import {
  InputAccessoryBar,
  InputAccessoryBarInput,
} from "@/components/ui/input-accessory-bar"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Text } from "@/components/ui/text"

export default function InputAccessoryBarCustomLabels() {
  return (
    <InputAccessoryBar
      previousLabel="Back"
      nextLabel="Forward"
      doneLabel="Close"
    >
      <KeyboardScrollView
        className="-m-4"
        contentContainerClassName="gap-4 p-4"
      >
        <View className="gap-1.5">
          <Text variant="small">Name</Text>
          <InputAccessoryBarInput placeholder="Name" autoFocus />
        </View>
        <View className="gap-1.5">
          <Text variant="small">Email</Text>
          <InputAccessoryBarInput placeholder="Email" />
        </View>
        <View className="gap-1.5">
          <Text variant="small">Phone</Text>
          <InputAccessoryBarInput placeholder="Phone" />
        </View>
        <View className="gap-1.5">
          <Text variant="small">City</Text>
          <InputAccessoryBarInput placeholder="City" />
        </View>
      </KeyboardScrollView>
    </InputAccessoryBar>
  )
}
