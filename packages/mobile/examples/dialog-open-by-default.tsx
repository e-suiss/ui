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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Text } from "@/components/ui/text"

export default function DialogOpenByDefault() {
  return (
    <View className="items-start">
      <Dialog defaultOpen>
        <DialogTrigger render={<Button variant="outline" />}>
          <Text>Edit profile</Text>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Tap save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <View className="gap-4">
            <View className="gap-2">
              <Label nativeID="dialog-name">Name</Label>
              <Input
                accessibilityLabelledBy="dialog-name"
                defaultValue="Pedro Duarte"
              />
            </View>
            <View className="gap-2">
              <Label nativeID="dialog-username">Username</Label>
              <Input
                accessibilityLabelledBy="dialog-username"
                defaultValue="@peduarte"
                autoCapitalize="none"
              />
            </View>
          </View>
          <DialogFooter>
            <DialogClose render={<Button variant="secondary" />}>
              <Text>Cancel</Text>
            </DialogClose>
            <Button>
              <Text>Save changes</Text>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </View>
  )
}
