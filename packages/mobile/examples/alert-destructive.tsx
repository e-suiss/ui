import { WarningIcon } from "phosphor-react-native"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertDestructive() {
  return (
    <Alert icon={WarningIcon} variant="destructive">
      <AlertTitle>Unable to process payment</AlertTitle>
      <AlertDescription>
        Please verify your billing information and try again.
      </AlertDescription>
    </Alert>
  )
}
