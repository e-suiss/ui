import { WarningCircleIcon } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertDestructive() {
  return (
    <div className="w-96">
      <Alert variant="destructive">
        <WarningCircleIcon weight="fill" />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your card was declined. Update your billing details to continue.
        </AlertDescription>
      </Alert>
    </div>
  )
}
