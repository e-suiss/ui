import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Text } from "@/components/ui/text"

export default function DialogDestructive() {
  return (
    <View className="items-start">
      <Dialog>
        <DialogTrigger render={<Button variant="destructive" />}>
          <Text>Delete account</Text>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete account</DialogTitle>
            <DialogDescription>
              This will permanently delete your account and all of its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>
              <Text>Cancel</Text>
            </DialogClose>
            <DialogClose render={<Button variant="destructive" />}>
              <Text>Delete</Text>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}
