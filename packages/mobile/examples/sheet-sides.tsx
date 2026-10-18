import { View } from "react-native"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Text } from "@/components/ui/text"

type Side = "top" | "right" | "bottom" | "left"

function ProfileContent({ side }: { side?: Side }) {
  return (
    <SheetContent side={side}>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Tap save when you&apos;re done.
        </SheetDescription>
      </SheetHeader>
      <View className="gap-4 px-6">
        <View className="gap-2">
          <Label nativeID="sheet-name">Name</Label>
          <Input
            accessibilityLabelledBy="sheet-name"
            defaultValue="Pedro Duarte"
          />
        </View>
        <View className="gap-2">
          <Label nativeID="sheet-username">Username</Label>
          <Input
            accessibilityLabelledBy="sheet-username"
            defaultValue="@peduarte"
            autoCapitalize="none"
          />
        </View>
      </View>
      <SheetFooter>
        <Button>
          <Text>Save changes</Text>
        </Button>
        <SheetClose render={<Button variant="secondary" />}>
          <Text>Close</Text>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

export default function SheetSides() {
  return (
    <View className="items-start gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" />}>
            <Text className="capitalize">{side}</Text>
          </SheetTrigger>
          <ProfileContent side={side} />
        </Sheet>
      ))}
    </View>
  )
}
