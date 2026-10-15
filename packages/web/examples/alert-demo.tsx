import { InfoIcon } from "@phosphor-icons/react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertDemo() {
  return (
    <div className="w-96">
      <Alert>
        <InfoIcon weight="fill" />
        <AlertTitle>Update available</AlertTitle>
        <AlertDescription>
          A new version is ready to install. Restart the app to apply it.
        </AlertDescription>
      </Alert>
    </div>
  )
}
