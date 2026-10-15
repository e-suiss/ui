import { InfoIcon } from "@phosphor-icons/react"
import { Alert, AlertTitle } from "@/components/ui/alert"

export default function AlertTitleOnly() {
  return (
    <div className="w-96">
      <Alert>
        <InfoIcon weight="fill" />
        <AlertTitle>Your changes have been saved.</AlertTitle>
      </Alert>
    </div>
  )
}
