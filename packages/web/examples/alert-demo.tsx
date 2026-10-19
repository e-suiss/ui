import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertDemo() {
  return (
    <Alert className="w-96">
      <IconPlaceholder
        lucide="InfoIcon"
        tabler="IconInfoCircle"
        hugeicons="InformationCircleIcon"
        phosphor="InfoIcon"
        remixicon="RiInformationLine"
      />
      <AlertTitle>Update available</AlertTitle>
      <AlertDescription>
        A new version is ready to install. Restart the app to apply it.
      </AlertDescription>
    </Alert>
  )
}
