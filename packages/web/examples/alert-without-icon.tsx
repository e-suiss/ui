import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertWithoutIcon() {
  return (
    <div className="w-96">
      <Alert>
        <AlertTitle>Scheduled maintenance</AlertTitle>
        <AlertDescription>
          The service will be unavailable on Sunday from 2:00 to 4:00 AM.
        </AlertDescription>
      </Alert>
    </div>
  )
}
