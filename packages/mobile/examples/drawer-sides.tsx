import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Text } from "@/components/ui/text"

export default function DrawerSides() {
  return (
    <View className="items-start gap-3">
      {(["up", "right", "down", "left"] as const).map((direction) => (
        <Drawer key={direction} swipeDirection={direction} showSwipeHandle>
          <DrawerTrigger render={<Button variant="outline" />}>
            <Text>Swipe {direction}</Text>
          </DrawerTrigger>
          <DrawerContent showCloseButton closeLabel="Done">
            <DrawerHeader>
              <DrawerTitle>Swipe {direction} to close</DrawerTitle>
              <DrawerDescription>
                This drawer is dismissed by swiping {direction}.
              </DrawerDescription>
            </DrawerHeader>
            <View className="p-4">
              <Text className="text-sm text-muted-foreground">
                Android back and the VoiceOver escape gesture also close it.
              </Text>
            </View>
          </DrawerContent>
        </Drawer>
      ))}
    </View>
  )
}
