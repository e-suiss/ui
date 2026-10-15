import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"

export default function AlertSheetNotDismissible() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <AlertSheet dismissible={false}>
        <AlertSheetTrigger asChild>
          <Button variant="outline">Delete order</Button>
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle className="sr-only">
                Delete order
              </AlertSheetTitle>
              <AlertSheetDescription>
                Order #1042 will be permanently deleted. This action cannot be
                undone.
              </AlertSheetDescription>
            </AlertSheetHeader>
            <AlertSheetAction variant="destructive">
              Delete Order
            </AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </div>
  )
}
