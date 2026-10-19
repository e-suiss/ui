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
        <DrawerTrigger render={<Button variant="outline" />}>
          Down
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>
              You have three unread messages.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-4">
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer floating={false} showSwipeHandle modal swipeDirection="up">
        <DrawerTrigger render={<Button variant="outline" />}>Up</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>
              You have three unread messages.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-4">
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer floating={false} showSwipeHandle modal swipeDirection="left">
        <DrawerTrigger render={<Button variant="outline" />}>
          Left
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>
              You have three unread messages.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-4">
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Drawer floating={false} showSwipeHandle modal swipeDirection="right">
        <DrawerTrigger render={<Button variant="outline" />}>
          Right
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Notifications</DrawerTitle>
            <DrawerDescription>
              You have three unread messages.
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="pt-4">
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  )
}
