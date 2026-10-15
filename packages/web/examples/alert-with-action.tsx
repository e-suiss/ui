import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

export default function AlertWithAction() {
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
        <AlertTitle>Storage almost full</AlertTitle>
        <AlertDescription>
          You have used 90% of your storage. Upgrade for more space.
        </AlertDescription>
        <AlertAction>
          <Button size="xs">Upgrade</Button>
        </AlertAction>
      </Alert>
    </div>
  )
}
