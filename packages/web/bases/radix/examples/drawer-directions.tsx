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

export default function DrawerDirections() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {(["down", "up", "left", "right"] as const).map((direction) => (
        <Drawer
          key={direction}
          floating={false}
          showSwipeHandle
          modal
          swipeDirection={direction}
        >
          <DrawerTrigger asChild>
            <Button variant="outline">
              {direction.charAt(0).toUpperCase() + direction.slice(1)}
            </Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Notifications</DrawerTitle>
              <DrawerDescription>
                You have three unread messages.
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter className="pt-4">
              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ))}
    </div>
  )
}
