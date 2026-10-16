import {
  Modal,
  ModalBody,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/patterns/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ModalWithCloseLabel() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Modal>
        <ModalTrigger render={<Button variant="outline" />}>
          Share project
        </ModalTrigger>
        <ModalContent closeLabel="Close">
          <ModalHeader>
            <ModalTitle>Share project</ModalTitle>
            <ModalDescription>
              Anyone with the link can view this project.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <Input
              readOnly
              aria-label="Project link"
              defaultValue="https://example.com/p/1042"
            />
          </ModalBody>
          <ModalFooter>
            <Button>Copy link</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
