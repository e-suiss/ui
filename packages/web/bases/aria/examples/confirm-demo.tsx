import {
  Confirm,
  ConfirmAction,
  ConfirmCancel,
  ConfirmContent,
  ConfirmDescription,
  ConfirmFooter,
  ConfirmHeader,
  ConfirmTitle,
} from "@/components/patterns/confirm"
import { Button } from "@/components/ui/button"

export default function ConfirmDemo() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <Confirm>
        <Button variant="outline">Delete order</Button>
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
