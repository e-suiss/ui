import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Text } from "@/components/ui/text"

export default function SheetWithCloseLabel() {
  return (
    <View className="items-start">
      <Sheet>
        <SheetTrigger render={<Button variant="outline" />}>
          <Text>Open with label</Text>
        </SheetTrigger>
        <SheetContent side="bottom" closeLabel="Done">
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>
              Choose what you want to be notified about.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </View>
  )
}
