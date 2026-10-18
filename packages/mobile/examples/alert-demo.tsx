import { CheckCircleIcon } from "phosphor-react-native"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AlertDemo() {
  return (
    <Alert icon={CheckCircleIcon}>
      <AlertTitle>Payment successful</AlertTitle>
      <AlertDescription>
        Your payment of $29.99 has been processed. A receipt has been sent to
        your email.
      </AlertDescription>
    </Alert>
  )
}
