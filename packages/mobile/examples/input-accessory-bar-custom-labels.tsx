import { View } from "react-native"
import {
  InputAccessoryBar,
  InputAccessoryBarInput,
} from "@/components/ui/input-accessory-bar"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Text } from "@/components/ui/text"

function Field({ label, autoFocus }: { label: string; autoFocus?: boolean }) {
  return (
    <View className="gap-1.5">
      <Text variant="small">{label}</Text>
      <InputAccessoryBarInput placeholder={label} autoFocus={autoFocus} />
    </View>
  )
}

function Form({ autoFocus = false }: { autoFocus?: boolean }) {
  return (
    <KeyboardScrollView className="-m-4" contentContainerClassName="gap-4 p-4">
      <Field label="Name" autoFocus={autoFocus} />
      <Field label="Email" />
      <Field label="Phone" />
      <Field label="City" />
    </KeyboardScrollView>
  )
}

export default function InputAccessoryBarCustomLabels() {
  return (
    <InputAccessoryBar
      previousLabel="Back"
      nextLabel="Forward"
      doneLabel="Close"
    >
      <Form autoFocus />
    </InputAccessoryBar>
  )
}
