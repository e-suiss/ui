import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Text } from "@/components/ui/text"

function GoalContent() {
  return (
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Move goal</DrawerTitle>
        <DrawerDescription>Set your daily activity goal.</DrawerDescription>
      </DrawerHeader>
      <View className="items-center gap-1 p-4">
        <Text className="text-5xl font-semibold tracking-tight">350</Text>
        <Text className="text-xs text-muted-foreground uppercase">
          Calories/day
        </Text>
      </View>
      <DrawerFooter>
        <Button>
          <Text>Submit</Text>
        </Button>
        <DrawerClose render={<Button variant="secondary" />}>
          <Text>Cancel</Text>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  )
}

export default function DrawerFloating() {
  return (
    <View className="items-start">
      <Drawer floating showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Open floating drawer</Text>
        </DrawerTrigger>
        <GoalContent />
      </Drawer>
    </View>
  )
}
