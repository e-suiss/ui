import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function DialogWithoutCloseButton() {
  return (
    <Dialog>
      <Button variant="outline">Show terms</Button>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Terms updated</DialogTitle>
          <DialogDescription>
            We have updated our terms of service. Please review the changes
            before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
