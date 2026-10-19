import { View } from "react-native"
import {
  Confirm,
  ConfirmAction,
  ConfirmCancel,
  ConfirmContent,
  ConfirmDescription,
  ConfirmFooter,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmTrigger,
} from "@/components/patterns/confirm"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function ConfirmOpenByDefault() {
  return (
    <View className="items-start">
      <Confirm defaultOpen>
        <ConfirmTrigger render={<Button variant="destructive" />}>
          <Text>Delete account</Text>
        </ConfirmTrigger>
        <ConfirmContent>
          <ConfirmHeader>
            <ConfirmTitle>Delete your account?</ConfirmTitle>
            <ConfirmDescription>
              This permanently deletes your account and all of its data.
            </ConfirmDescription>
          </ConfirmHeader>
          <ConfirmFooter>
            <ConfirmCancel>Cancel</ConfirmCancel>
            <ConfirmAction variant="destructive">Delete Account</ConfirmAction>
          </ConfirmFooter>
        </ConfirmContent>
      </Confirm>
    </View>
  )
}
