import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Text } from "@/components/ui/text"

export default function DialogWithoutCloseButton() {
  return (
    <View className="items-start">
      <Dialog>
        <DialogTrigger render={<Button variant="outline" />}>
          <Text>Show terms</Text>
        </DialogTrigger>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Terms updated</DialogTitle>
            <DialogDescription>
              We have updated our terms of service. Please review the changes
              before continuing.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter showCloseButton>
            <Button>
              <Text>Accept</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}
