import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Text } from "@/components/ui/text"

export default function DialogWithCloseLabel() {
  return (
    <View className="items-start">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          <Text>Open settings</Text>
        </DialogTrigger>
        <DialogContent closeLabel="Done">
          <DialogHeader>
            <DialogTitle>Notification settings</DialogTitle>
            <DialogDescription>
              Choose how you want to be notified about activity in your
              workspace.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </View>
  )
}
