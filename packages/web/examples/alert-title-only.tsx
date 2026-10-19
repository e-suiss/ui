import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Alert, AlertTitle } from "@/components/ui/alert"

export default function AlertTitleOnly() {
  return (
    <Alert className="w-96">
      <IconPlaceholder
        lucide="InfoIcon"
        tabler="IconInfoCircle"
        hugeicons="InformationCircleIcon"
        phosphor="InfoIcon"
        remixicon="RiInformationLine"
      />
      <AlertTitle>Your changes have been saved.</AlertTitle>
    </Alert>
  )
}
