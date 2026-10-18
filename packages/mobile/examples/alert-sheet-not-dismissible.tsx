import { View } from "react-native"
import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function AlertSheetNotDismissible() {
  return (
    <View className="items-start">
      <AlertSheet dismissible={false}>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          <Text>Sign out</Text>
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle>Sign out of all devices?</AlertSheetTitle>
            </AlertSheetHeader>
            <AlertSheetAction variant="destructive">Sign Out</AlertSheetAction>
            <AlertSheetAction disabled>Keep Signed In Here</AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </View>
  )
}
