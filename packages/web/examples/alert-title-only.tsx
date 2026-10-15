import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Alert, AlertTitle } from "@/components/ui/alert"

export default function AlertTitleOnly() {
  return (
    <div className="w-96">
      <Alert>
        <IconPlaceholder
          lucide="InfoIcon"
          tabler="IconInfoCircle"
          hugeicons="InformationCircleIcon"
          phosphor="InfoIcon"
          remixicon="RiInformationLine"
        />
        <AlertTitle>Your changes have been saved.</AlertTitle>
      </Alert>
    </div>
  )
}
