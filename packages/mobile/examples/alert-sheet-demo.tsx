import { View } from "react-native"
import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

function SheetBody() {
  return (
    <AlertSheetContent>
      <AlertSheetGroup>
        <AlertSheetHeader>
          <AlertSheetTitle>Delete this photo?</AlertSheetTitle>
          <AlertSheetDescription>
            This photo will be deleted from all of your devices.
          </AlertSheetDescription>
        </AlertSheetHeader>
        <AlertSheetAction>Save to Files</AlertSheetAction>
        <AlertSheetAction variant="destructive">Delete Photo</AlertSheetAction>
      </AlertSheetGroup>
      <AlertSheetCancel>Cancel</AlertSheetCancel>
    </AlertSheetContent>
  )
}

export default function AlertSheetDemo() {
  return (
    <View className="items-start">
      <AlertSheet>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          <Text>Show sheet</Text>
        </AlertSheetTrigger>
        <SheetBody />
      </AlertSheet>
    </View>
  )
}
