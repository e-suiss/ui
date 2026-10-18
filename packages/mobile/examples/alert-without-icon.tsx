import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertWithoutIcon() {
  return (
    <Alert>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        You can add components to your app using the registry.
      </AlertDescription>
    </Alert>
  )
}
