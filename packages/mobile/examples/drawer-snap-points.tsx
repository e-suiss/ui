import { ScrollView, View } from "react-native"
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

const ITEMS = Array.from({ length: 20 }, (_, index) => `Item ${index + 1}`)

export default function DrawerSnapPoints() {
  return (
    <View className="items-start">
      <Drawer snapPoints={[0.4, 1]} showSwipeHandle>
        <DrawerTrigger render={<Button variant="outline" />}>
          <Text>Open with snap points</Text>
        </DrawerTrigger>
        <DrawerContent showCloseButton>
          <DrawerHeader>
            <DrawerTitle>Snap points</DrawerTitle>
            <DrawerDescription>
              Drag up to expand, drag down to collapse or dismiss.
            </DrawerDescription>
          </DrawerHeader>
          <ScrollView contentContainerClassName="gap-3 p-4">
            {ITEMS.map((item) => (
              <View
                key={item}
                className="h-12 justify-center rounded-xl bg-muted px-4"
              >
                <Text>{item}</Text>
              </View>
            ))}
          </ScrollView>
        </DrawerContent>
      </Drawer>
    </View>
  )
}
