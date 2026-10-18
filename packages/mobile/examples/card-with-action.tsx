import { BellIcon } from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function CardWithAction() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>You have 3 unread messages.</CardDescription>
        <CardAction>
          <Button size="icon" variant="ghost">
            <Icon as={BellIcon} />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <Text className="text-sm">
          Your call has been confirmed for tomorrow at 10:00.
        </Text>
      </CardContent>
      <CardFooter>
        <Button block>
          <Text>Mark all as read</Text>
        </Button>
      </CardFooter>
    </Card>
  )
}
