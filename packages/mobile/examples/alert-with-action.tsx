import { InfoIcon } from "phosphor-react-native"
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Text } from "@/components/ui/text"

export default function AlertWithAction() {
  return (
    <Alert icon={InfoIcon}>
      <AlertTitle>New version available</AlertTitle>
      <AlertDescription>
        Update now to get the latest features and fixes.
      </AlertDescription>
      <AlertAction>
        <Button size="sm" variant="tinted">
          <Text>Update</Text>
        </Button>
      </AlertAction>
    </Alert>
  )
}
