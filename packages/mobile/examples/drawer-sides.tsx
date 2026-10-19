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
      <Drawer swipeDirection="up" showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Swipe up</Text>
        </DrawerTrigger>
        <DrawerContent showCloseButton closeLabel="Done">
          <DrawerHeader>
            <DrawerTitle>Swipe up to close</DrawerTitle>
            <DrawerDescription>
              This drawer is dismissed by swiping up.
            </DrawerDescription>
          </DrawerHeader>
          <View className="p-4">
            <Text className="text-sm text-muted-foreground">
              Android back and the VoiceOver escape gesture also close it.
            </Text>
          </View>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="right" showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Swipe right</Text>
        </DrawerTrigger>
        <DrawerContent showCloseButton closeLabel="Done">
          <DrawerHeader>
            <DrawerTitle>Swipe right to close</DrawerTitle>
            <DrawerDescription>
              This drawer is dismissed by swiping right.
            </DrawerDescription>
          </DrawerHeader>
          <View className="p-4">
            <Text className="text-sm text-muted-foreground">
              Android back and the VoiceOver escape gesture also close it.
            </Text>
          </View>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="down" showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Swipe down</Text>
        </DrawerTrigger>
        <DrawerContent showCloseButton closeLabel="Done">
          <DrawerHeader>
            <DrawerTitle>Swipe down to close</DrawerTitle>
            <DrawerDescription>
              This drawer is dismissed by swiping down.
            </DrawerDescription>
          </DrawerHeader>
          <View className="p-4">
            <Text className="text-sm text-muted-foreground">
              Android back and the VoiceOver escape gesture also close it.
            </Text>
          </View>
        </DrawerContent>
      </Drawer>
      <Drawer swipeDirection="left" showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Swipe left</Text>
        </DrawerTrigger>
        <DrawerContent showCloseButton closeLabel="Done">
          <DrawerHeader>
            <DrawerTitle>Swipe left to close</DrawerTitle>
            <DrawerDescription>
              This drawer is dismissed by swiping left.
            </DrawerDescription>
          </DrawerHeader>
          <View className="p-4">
            <Text className="text-sm text-muted-foreground">
              Android back and the VoiceOver escape gesture also close it.
            </Text>
          </View>
        </DrawerContent>
      </Drawer>
    </View>
  )
}
