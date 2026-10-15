import { Button, buttonVariants } from "@/components/ui/button"
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

export default function DrawerNonModal() {
  return (
    <Drawer
      swipeDirection="down"
      floating={false}
      showSwipeHandle
      modal={false}
    >
      <DrawerTrigger className={buttonVariants({ variant: "outline" })}>
        Open drawer
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Move goal</DrawerTitle>
          <DrawerDescription>Set your daily activity goal.</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-1 p-4">
          <span className="text-5xl font-semibold tracking-tight">350</span>
          <span className="text-muted-foreground text-xs uppercase">
            Calories per day
          </span>
        </div>
        <DrawerFooter>
          <Button>Save goal</Button>
          <DrawerClose className={buttonVariants({ variant: "outline" })}>
            Cancel
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
