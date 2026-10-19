import * as React from "react"
import { View } from "react-native"
import {
  InputAccessoryBar,
  InputAccessoryBarInput,
  useInputAccessoryBarInput,
} from "@/components/ui/input-accessory-bar"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"

function MessageField() {
  const accessory = useInputAccessoryBarInput()
  return (
    <View className="gap-1.5">
      <Text variant="small">Message</Text>
      <Textarea
        placeholder="Message"
        ref={accessory.ref}
        inputAccessoryViewID={accessory.inputAccessoryViewID}
        onFocus={accessory.onFocus}
        onBlur={accessory.onBlur}
      />
    </View>
  )
}

export default function InputAccessoryBarWithTextarea() {
  const [log, setLog] = React.useState("Tap Done.")
  return (
    <InputAccessoryBar onDone={() => setLog("Done pressed")}>
      <KeyboardScrollView
        className="-m-4"
        contentContainerClassName="gap-4 p-4"
      >
        <View className="gap-1.5">
          <Text variant="small">Subject</Text>
          <InputAccessoryBarInput placeholder="Subject" autoFocus />
        </View>
        <MessageField />
        <Text role="status" className="text-sm text-muted-foreground">
          {log}
        </Text>
      </KeyboardScrollView>
    </InputAccessoryBar>
  )
}
