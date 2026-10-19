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
      <Drawer floating={false} showSwipeHandle modal swipeDirection="down">
        <DrawerTrigger asChild>
          <Button variant="outline">Down</Button>
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
      <Drawer floating={false} showSwipeHandle modal swipeDirection="up">
        <DrawerTrigger asChild>
          <Button variant="outline">Up</Button>
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
      <Drawer floating={false} showSwipeHandle modal swipeDirection="left">
        <DrawerTrigger asChild>
          <Button variant="outline">Left</Button>
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
      <Drawer floating={false} showSwipeHandle modal swipeDirection="right">
        <DrawerTrigger asChild>
          <Button variant="outline">Right</Button>
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
    </div>
  )
}
