import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"

type Side = "top" | "right" | "bottom" | "left"

function ProfileSheet({
  side = "right",
  showCloseButton = true,
  closeLabel,
}: {
  side?: Side
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <SheetContent
      side={side}
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
    >
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Update your details and save when you are done.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 px-6">
        <div className="grid gap-2">
          <Label htmlFor="sheet-name">Name</Label>
          <Input id="sheet-name" defaultValue="Jordan Lee" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sheet-username">Username</Label>
          <Input id="sheet-username" defaultValue="@jordanlee" />
        </div>
      </div>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <Button slot="close" variant="secondary">
          Cancel
        </Button>
      </SheetFooter>
    </SheetContent>
  )
}

export default function SheetWithCloseLabel() {
  return (
    <Sheet>
      <Button variant="outline">Open sheet</Button>
      <ProfileSheet closeLabel="Done" />
    </Sheet>
  )
}
