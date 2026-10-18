import { InfoIcon } from "phosphor-react-native"
import { Alert, AlertTitle } from "@/components/ui/alert"

export default function AlertTitleOnly() {
  return (
    <Alert icon={InfoIcon}>
      <AlertTitle>Your session will expire in 5 minutes.</AlertTitle>
    </Alert>
  )
}
