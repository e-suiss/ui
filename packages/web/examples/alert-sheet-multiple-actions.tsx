import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"

export default function AlertSheetMultipleActions() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <AlertSheet>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          Close draft
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle>Save changes to this draft?</AlertSheetTitle>
            </AlertSheetHeader>
            <AlertSheetAction>Save Draft</AlertSheetAction>
            <AlertSheetAction variant="destructive">
              Delete Draft
            </AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </div>
  )
}
