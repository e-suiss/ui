import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertDestructive() {
  return (
    <div className="w-96">
      <Alert variant="destructive">
        <IconPlaceholder
          lucide="CircleAlertIcon"
          tabler="IconAlertCircle"
          hugeicons="AlertCircleIcon"
          phosphor="WarningCircleIcon"
          remixicon="RiErrorWarningLine"
        />
        <AlertTitle>Payment failed</AlertTitle>
        <AlertDescription>
          Your card was declined. Update your billing details to continue.
        </AlertDescription>
      </Alert>
    </div>
  )
}
