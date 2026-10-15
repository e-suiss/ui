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

export default function AlertSheetWithTitle() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <AlertSheet>
        <AlertSheetTrigger render={<Button variant="outline" />}>
          Sign out
        </AlertSheetTrigger>
        <AlertSheetContent>
          <AlertSheetGroup>
            <AlertSheetHeader>
              <AlertSheetTitle>Sign out of your account?</AlertSheetTitle>
              <AlertSheetDescription>
                You will need to sign in again to access your projects.
              </AlertSheetDescription>
            </AlertSheetHeader>
            <AlertSheetAction variant="destructive">Sign Out</AlertSheetAction>
          </AlertSheetGroup>
          <AlertSheetCancel>Cancel</AlertSheetCancel>
        </AlertSheetContent>
      </AlertSheet>
    </div>
  )
}
