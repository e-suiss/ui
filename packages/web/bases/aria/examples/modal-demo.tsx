import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/patterns/modal"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ModalDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Modal>
        <ModalTrigger className={buttonVariants({ variant: "outline" })}>
          Edit profile
        </ModalTrigger>
        <ModalContent>
          <ModalHeader>
            <ModalTitle>Edit profile</ModalTitle>
            <ModalDescription>
              Update your name and username. Click save when you are done.
            </ModalDescription>
          </ModalHeader>
          <ModalBody className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="modal-name">Name</Label>
              <Input id="modal-name" defaultValue="Ada Lovelace" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="modal-username">Username</Label>
              <Input id="modal-username" defaultValue="@ada" />
            </div>
          </ModalBody>
          <ModalFooter>
            <ModalClose className={buttonVariants({ variant: "secondary" })}>
              Cancel
            </ModalClose>
            <Button>Save changes</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
