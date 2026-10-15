import {
  Confirm,
  ConfirmAction,
  ConfirmCancel,
  ConfirmContent,
  ConfirmDescription,
  ConfirmFooter,
  ConfirmHeader,
  ConfirmTitle,
  ConfirmTrigger,
} from "@/components/patterns/confirm"
import { Button } from "@/components/ui/button"

export default function ConfirmDismissible() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Confirm dismissible>
        <ConfirmTrigger asChild>
          <Button variant="outline">Delete order</Button>
        </ConfirmTrigger>
        <ConfirmContent>
          <ConfirmHeader>
            <ConfirmTitle>Delete order?</ConfirmTitle>
            <ConfirmDescription>
              Order #1042 will be permanently deleted. This action cannot be
              undone.
            </ConfirmDescription>
          </ConfirmHeader>
          <ConfirmFooter>
            <ConfirmCancel>Cancel</ConfirmCancel>
            <ConfirmAction variant="destructive">Delete</ConfirmAction>
          </ConfirmFooter>
        </ConfirmContent>
      </Confirm>
    </div>
  )
}
